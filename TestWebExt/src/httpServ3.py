from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib
import matplotlib.pyplot as plt


hostName = "localhost"
hostPort = 8002

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        message = ''
        if (query):
            query_components = dict(qc.split("=") for qc in query.split("&"))
            if (query_components['operation']=='circleDiagram'):
                message += "building diagramm! \n"
                labels = 'Выполнено', 'Просрочено', 'Отложено'
                sizes = [query_components['done'], query_components['outTerm'], query_components['changedDate']]
                explode = (0.1, 0, 0)
                mycolors = ["g", "r", "b"]
                fig1, ax1 = plt.subplots()
                ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
                        shadow=True, startangle=90, colors = mycolors)
                ax1.axis('equal') 
                plt.legend(title = "Результативность выполнения:")
                # htmlDate = ''
                plt.savefig("temp.html", format="svg")
                with open('temp.html', 'r') as g:
                    htmlDate = g.read()

                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(bytes('<html><meta charset = "utf-8" /> <head><title>Количественный отчет производительности</title></head>', "utf-8"))
                self.wfile.write(bytes("<body>", "utf-8"))
                self.wfile.write(bytes('<div style = "text-align:center;">', "utf-8"))
                self.wfile.write(bytes("<h3>%s</h3>" % "Отчет производительности", "utf-8"))
                self.wfile.write(bytes("<div>%s</div>" % htmlDate, "utf-8"))
                self.wfile.write(bytes("<p>message: %s</p>" % message, "utf-8"))
                self.wfile.write(bytes("</div>", "utf-8"))
                self.wfile.write(bytes("</body></html>", "utf-8"))

myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))