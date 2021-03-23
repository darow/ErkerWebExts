import http.server
import socketserver
import sys
import BaseHTTPServer

PORT = 8001

def MakeHandlerClassFromArgv(init_args):
    class CustomHandler(http.server.BaseHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
             super(CustomHandler, self).__init__(*args, **kwargs)
             print(init_args)
            #  do_stuff_with(self, init_args)
    return CustomHandler

if __name__ == "__main__":
    server_address = ('', PORT)
    HandlerClass = MakeHandlerClassFromArgv(sys.argv)
    httpd = HTTPServer(server_address, HandlerClass)
    httpd.serve_forever()