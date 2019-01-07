package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net/http"

	"os/exec"

	"github.com/gorilla/websocket"
)

// Set addr flag
var addr = flag.String("addr", "localhost:8080", "http service address")

// This opens the websocket connection
var upgrader = websocket.Upgrader{}

// This function generates the callback connected to the game server
func makews(uplink func([]byte)) func(http.ResponseWriter, *http.Request) {

	// This function is the callback for when /ws requests are opened
	return func(response http.ResponseWriter, request *http.Request) {

		// Open the websocket
		socket, err := upgrader.Upgrade(response, request, nil)

		// Get upgrade errors
		if err != nil {
			log.Print("Socket init error:", err)
			return
		}

		// Socket init
		log.Println("Socket opened.")

		// Response loop
		for {
			// Incoming message
			_, data, err := socket.ReadMessage()

			// Error handling
			if err != nil {
				log.Println("read:", err)
				break
			}

			// On-message action
			uplink(data)
			uplink([]byte("\r\n"))
		}

		// This callback closes the socket
		defer func() {
			socket.Close()
			log.Println("Socket closed.")
		}()

	}

}

// This function manages the game server and returns a function which communicates with it
func game() func([]byte) {

	log.Println("Starting game server...")
	child := exec.Command("cargo", "run")

	// Set up I/O
	out, err := child.StdoutPipe()
	// Error handling
	if err != nil {
		log.Fatalf("Creating stdout for server failed: %s\n", err)
	}

	in, err := child.StdinPipe()
	// Error handling
	if err != nil {
		log.Fatalf("Piping stdin to server failed: %s\n", err)
	}

	// Actually start it
	err = child.Start()
	if err != nil {
		log.Fatalf("Starting server failed: %s\n", err)
	}

	// Do stuff with the output
	scanner := bufio.NewScanner(out)
	go func() {
		for scanner.Scan() {
			fmt.Printf("GAME: %s\n", scanner.Text())
		}
	}()

	// Return an input handler so we can work with it
	return func(message []byte) {
		in.Write(message)
	}

}

func main() {

	// Set env attributes
	flag.Parse()
	log.SetFlags(0)

	// Start the game
	uplink := game()

	// Connect the websocket handler to the game server
	ws := makews(uplink)

	// Set up the callback for new websocket connections
	http.HandleFunc("/ws", ws)

	// Serve static files
	static := http.FileServer(http.Dir("./dist/client"))
	http.Handle("/", static)

	// Start serving the site
	log.Printf("Listening on %s.\n", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))

}
