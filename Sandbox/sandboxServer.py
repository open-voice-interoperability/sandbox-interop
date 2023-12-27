# This is the simple server that hosts the browser resources
# Just run it from the root directory for your "sandbox"
#     (the dir containing the Browsers folder)
#     python sandboxServer.py

from http.server import HTTPServer, SimpleHTTPRequestHandler
#import requests
import os
import mimetypes
import json
from AssistantServers.OVONServerModules.simpleAssistant import exchange
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
            print("Requested path:", self.path)
            if self.path.startswith('/Report/Logs/'):
                logs_directory = os.path.join(os.getcwd(), "Report", "Logs")
                if os.path.isdir(logs_directory):
                    log_files = [f for f in os.listdir(logs_directory) if f.endswith(".log.txt")]
                    print("Response data:", log_files)

                    # Join the list of log files into a string with each file on a new line
                    response_data = '\n'.join(log_files) + '\n'

                    # Send the response as plain text
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(response_data.encode('utf-8'))
            
                else:
                    self.send_error(500, "Logs directory not found.")
                
                
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
        # read the message and convert it into a python dictionary
        length = int(self.headers.get('content-length'))
        #length = int(self.headers.getheader('content-length'))
        message = json.loads(self.rfile.read(length))
        
        # add a property to the object, just to mess with data
        message['received'] = 'ok'

        # Do assistant stuff
        responseJSONStr = exchange( message)
        
        # send the message back
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(responseJSONStr, 'utf-8'))
        #self.wfile.write(bytes(json.dumps(message, ensure_ascii=False), 'utf-8'))

httpd = HTTPServer(('localhost', port), Serv)
httpd.serve_forever()

# python sandboxServer.py
