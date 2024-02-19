package main
import (
    "log"
    "net/http"
    "strings"
)

func main() {
    // assetsHandler := http.FileServer(http.Dir("./"))    
    
    http.HandleFunc("/sw",func(w http.ResponseWriter, r *http.Request){
        w.Header().Add("Content-Type", "application/javascript")
        http.ServeFile(w,r,"./sw.js")
    })

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
        path := "."+r.URL.Path
        var contentType string

        if strings.HasSuffix(path,".css"){
            contentType = "text/css"
        }else if strings.HasSuffix(path,".html"){
            contentType = "text/html"
        }else if strings.HasSuffix(path,".js"){
            contentType = "application/javascript"
        }

        if contentType != "" {
            w.Header().Add("Content Type",contentType)    
        }
        w.Header().Add("Cache-Control", "no-cache, no-store, must-revalidate")
        w.Header().Add("Pragma", "no-cache")
        w.Header().Add("Expires", "0")

        http.ServeFile(w, r,path)
    })

    log.Println("Server running on :8000")
    log.Fatal(http.ListenAndServe(":8000", nil))
}
