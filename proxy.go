package main

import (
	"encoding/json"
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

	rawURL := os.Getenv("TARGET_PROXY_URL")
	nextURL, err := url.Parse(rawURL)
	if err != nil || nextURL == nil {
		log.Fatal("Invalid TARGET_PROXY_URL environment variable")
	}
	proxy := httputil.NewSingleHostReverseProxy(nextURL)

	// Inject headers & log Set-Cookie
	proxy.ModifyResponse = func(resp *http.Response) error {
		for _, cookie := range resp.Header["Set-Cookie"] {
			fmt.Println("🍪 [Proxy] Set-Cookie:", cookie)
		}
		return nil
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("📦 Proxy / ->", nextURL.Host)
		r.Host = nextURL.Host
		r.Header.Set("X-Forwarded-Host", r.Host)
		r.Header.Set("X-Forwarded-Proto", "http")
		proxy.ServeHTTP(w, r)
	})

	// Setup API proxy
	apiURL := os.Getenv("TARGET_PROXY_URL_API")
	if apiURL != "" {
		apiNextURL, err := url.Parse(apiURL)
		if err != nil || apiNextURL == nil {
			log.Fatal("Invalid TARGET_PROXY_URL_API environment variable")
		}
		apiProxy := httputil.NewSingleHostReverseProxy(apiNextURL)

		apiProxy.ModifyResponse = func(resp *http.Response) error {
			for _, cookie := range resp.Header["Set-Cookie"] {
				fmt.Println("🍪 [API] Set-Cookie:", cookie)
			}
			return nil
		}

		http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
			fmt.Println("📦 Proxy /api/ ->", apiNextURL.Host)
			r.Host = apiNextURL.Host
			r.Header.Set("X-Forwarded-Host", r.Host)
			r.Header.Set("X-Forwarded-Proto", "http")
			apiProxy.ServeHTTP(w, r)
		})
	}

	// App discovery endpoint
	handleGetURL()

	log.Println("🚀 Proxy server ready at :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

var ListApps = map[string]string{
	"default-app": "http://172.24.4.25:3000",
	"app1":        "http://172.24.4.25:3001",
	"app2":        "http://172.24.4.25:3002",
	"app3":        "http://172.24.4.25:3003",
}

func handleGetURL() {
	http.HandleFunc("/apps", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("🌐 Received request for /apps")

		apps := r.URL.Query().Get("apps")
		if apps == "" {
			apps = "default-app"
		}

		response := map[string]string{"url": ListApps[apps]}

		w.Header().Set("Content-Type", "application/json")
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			return
		}
	})
}
