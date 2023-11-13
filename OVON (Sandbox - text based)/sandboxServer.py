# This is the simple server that hosts the browser resources
# Just run it from the root directory for your "sandbox"
#     (the dir containing the Browsers folder)
#     python sandboxServer.py

from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests

port = 6002
print ("Started Sandbox Browser Service: ", port, "\n")

class Serv(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        try:
            file_to_open = open(self.path[1:]).read()
            self.send_response(200)
        except:
            file_to_open = "File not found"
            self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))
    def do_PUT(self):
#        print self.headers
        length = int(self.headers["Content-Length"])
        path = self.translate_path(self.path)
        with open(path, "wb") as dst:
            dst.write(self.rfile.read(length))
            self.send_response(200)

httpd = HTTPServer(('localhost', port), Serv)
httpd.serve_forever()