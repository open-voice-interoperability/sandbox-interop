# This is the simple server that hosts the browser resources
# Just run it from the root directory for your "sandbox"
#     (the dir containing the Browsers folder)
#     python sandboxServer.py

from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests
import os
import mimetypes

port = 6002
print ("Started Sandbox Browser Service: ", port, "\n")

class Serv(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, 'OK')
        self.send_header('allow','GET,HEAD,POST,OPTIONS,CONNECT,PUT,DAV,dav')
        self.send_header('x-api-access-type','file')
        self.end_headers()
    def do_GET(self):
        if self.path == '/':
            self.path = '/sbStartup.html'
        try:
            if self.path.__contains__(".png") or self.path.__contains__(".jpg"):
                file_to_open = self.path
                file_to_open = file_to_open[1:]
                imgfile = open(file_to_open, 'rb').read()
                mimetype = mimetypes.MimeTypes().guess_type(file_to_open)[0]
                self.send_response(200)
                self.send_header('Content-type', mimetype)
                self.end_headers()
                self.wfile.write(imgfile)
            else:
                file_to_open = open(self.path[1:]).read()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(file_to_open, 'utf-8'))
        except:
            file_to_open = "File not found"
            self.send_response(404)
        self.end_headers()
        #self.wfile.write(bytes(file_to_open, 'utf-8'))

        #print(os.listdir())
    def do_PUT(self):
        rootpath = os.path.realpath(os.path.dirname(__file__))
        rootpath = rootpath.replace("\\", "/" )
        print( "Directory of the Sandbox: ", rootpath)
        length = int(self.headers['Content-Length'])
        path = self.translate_path(self.path)
        (srcpath, srcfile) = os.path.split(path)
        print( "the url path & file: ", srcpath, "  &  ", srcfile)

        if srcfile.__contains__(".log."):
            midpath = "/Report/Logs/"
        elif srcfile.__contains__(".seq."):
            midpath = "/Report/Sequence/"
        path = rootpath + midpath + srcfile
        print( "Full Path: ", path)

        with open(path, "wb") as dst:
            dst.write(self.rfile.read(length))
        self.send_response(200, 'OK')
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
    def do_POST(self):
        #for f in os.listdir("C:/ejDev/OVON/sandbox-interop/OVON (Sandbox - text based)"):
        #    print(f)
        res = []
        for path in os.listdir(self.path):
            if os.path.isfile(os.path.join(self.path, path)): # is it a file?
                res.append(path) 
        return res

httpd = HTTPServer(('localhost', port), Serv)
httpd.serve_forever()