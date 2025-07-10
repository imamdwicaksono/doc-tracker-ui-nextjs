package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
		file, err := os.Create(".env")
		if err != nil {
			fmt.Println("Error creating .env file")
			return
		}
		// Write default values
		_, err = file.WriteString("TARGET_PROXY_URL=http://localhost:3001\nTARGET_PROXY_URL_API=http://localhost:3002\n")
		if err != nil {
			fmt.Println("Error writing default values to .env file")
			file.Close()
			return
		}
		file.Close()
	}
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}
	// Get the TARGET_PROXY_URL from environment variables
	rawURL := os.Getenv("TARGET_PROXY_URL")
	nextURL, err := url.Parse(rawURL)
	if err != nil || nextURL == nil {
		log.Fatal("Invalid TARGET_PROXY_URL environment variable")
	}
	// Proxy handler
	proxy := httputil.NewSingleHostReverseProxy(nextURL)

	// Handle all to proxy
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	// Handle /api to proxy
	apiURL := os.Getenv("TARGET_PROXY_URL_API")
	if apiURL != "" {
		apiNextURL, err := url.Parse(apiURL)
		if err != nil || apiNextURL == nil {
			log.Fatal("Invalid TARGET_PROXY_URL_API environment variable")
		}
		apiProxy := httputil.NewSingleHostReverseProxy(apiNextURL)
		http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
			// Modify the request URL to point to the API proxy
			// r.URL.Path = r.URL.Path[len("/api/"):]
			r.Host = apiNextURL.Host
			apiProxy.ServeHTTP(w, r)
		})
	}

	log.Println("Go Proxy listening at :3000 and redirecting to Next.js")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
