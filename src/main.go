package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Set addr flag
var addr = flag.String("addr", "localhost:8080", "http service address")

// This opens the websocket connection
var upgrader = websocket.Upgrader{}

// This function is the callback for when /ws requests are opened
func ws(response http.ResponseWriter, request *http.Request) {

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
		log.Printf("recv: %s", data)
	}

	// This callback closes the socket
	defer func() {
		socket.Close()
		log.Println("Socket closed.")
	}()

}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", ws)

	// Serve static files
	static := http.FileServer(http.Dir("./client"))
	http.Handle("/", static)

	// Start serving the site
	log.Println("Listening...")
	log.Fatal(http.ListenAndServe(*addr, nil))
}
