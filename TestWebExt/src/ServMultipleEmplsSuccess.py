from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib
import matplotlib.pyplot as plt
import json
from urllib.parse import unquote


hostName = "localhost"
hostPort = 8002

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query = unquote(urllib.parse.urlparse(self.path).query)
        if (query):
            query_components = dict(qc.split("=") for qc in query.split("&"))
            if (query_components['operation']=='circleDiagram'):
                data = json.loads(str(query_components['employeesData']))
                labels = 'Просрочено', 'Не просрочено'

                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(bytes('''<html>
                <meta charset = "utf-8" />
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                    <title>Количественный отчет производительности</title>
                </head>
                <body>
                    <div class = "text-center pb-5" >
                        <h2>Отчет производительности</h2>
                    </div>
                    <div class="container-fluid">
                        <div class="row d-flex justify-content-center">
                            ''', "utf-8"))  
                    
                for employee in data:
                    
                    notExpiredCount = int(employee['taskCount']) - int(employee['expiredCount'])
                    sizes = [employee['expiredCount'], notExpiredCount]
                    explode = (0.1, 0)
                    mycolors = ["r", "g"]
                    fig1, ax1 = plt.subplots()
                    ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
                            shadow=True, startangle=90, colors = mycolors)
                    ax1.axis('equal') 
                    plt.legend(title = "Результативность выполнения:")
                    plt.savefig("temp.html", format="svg")
                    with open('temp.html', 'r') as g:
                        htmlDate = g.read()

                    self.wfile.write(bytes('''
                        <div class="col-xl-4 col-lg-6 col-12 text-center pb-5">
                            <h3 class = ''>%s</h3>
                            <div>%s</div>
                            <div>Всего: %s</div>
                            <div>Просрочено: %s</div>
                            <div>Не просрочено: %s</div>
                            <div>___________________________________</div>
                        </div>
                        ''' %(
                            employee['fio'],
                            htmlDate,
                            employee['taskCount'],
                            employee['expiredCount'],
                            str(notExpiredCount)), "utf-8"))
                    
                self.wfile.write(bytes("</div></div>", "utf-8"))
                self.wfile.write(bytes("</body></html>", "utf-8"))              

myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))