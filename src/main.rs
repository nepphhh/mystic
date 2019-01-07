use std::io;

fn main() {
    // Open the server
    println!("Game server active.");

    // Input variable
    let mut input = String::new();

    // Start the server
    let running = true;

    while running {

        // Handle input and decide what to do
        match io::stdin().read_line(&mut input) { // Put it all into the buffer
            Err(error) => println!("error: {}", error),
            Ok(_) => {

                // Read the input
                println!("recv: {}", input);

                // Empty the buffer
                input.clear();

            },
        };

    }
    
}