from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib
import matplotlib.pyplot as plt
import json


hostName = "localhost"
hostPort = 8002

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        message = ''
        if (query):
            query_components = dict(qc.split("=") for qc in query.split("&"))
            if (query_components['operation']=='tasksReportPerDay'):
                data = json.loads(str(query_components['employeesData']))

                # message += "building diagramm! \n"
                # labels = 'Просрочено', 'Не просрочено'
                # sizes = [query_components['outTerm'], query_components['notOutTerm'],]
                # explode = (0.1, 0)
                # mycolors = ["r", "g"]
                # fig1, ax1 = plt.subplots()
                # ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
                #         shadow=True, startangle=90, colors = mycolors)
                # ax1.axis('equal')
                # plt.legend(title = "Результативность выполнения:")
                # plt.savefig("temp.html", format="svg")
                # with open('temp.html', 'r') as g:
                #     htmlDate = g.read()
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(bytes('''<html>
                <meta charset = "utf-8"/>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                    <title>Количественный отчет производительности</title>
                    <script type="text/javascript" src="http://ajax.microsoft.com/ajax/jquery/jquery-1.4.2.min.js"></script> 
                    <script>
                        function hideAll() {
                            console.log('hideAll')

                            $('#circleBtn').removeClass('btn-outline-info')
                            $('#barsBtn').removeClass('btn-outline-info')
                            $('#circleBtn').addClass('btn-outline-secondary')
                            $('#barsBtn').addClass('btn-outline-secondary')

                            $('#circles').addClass('d-none')
                            $('#bars').addClass('d-none')
                        }
                        
                        function showCircles() {
                            console.log('showCircles');

                            hideAll()
                            $('#circles').removeClass('d-none')
                            $('#circleBtn').addClass('btn-outline-info')
                        }

                        function showBars() {
                            console.log('showBars')

                            hideAll()
                            $('#bars').removeClass('d-none')
                            $('#barsBtn').addClass('btn-outline-info')
                        }
                    </script>
                </head>
                <body>
                    <div class = "text-center pb-5">
                        <h2>Отчет производительности</h2>
                        <button type="button" id="circleBtn" class="btn btn-outline-info" onClick='showCircles()'>Круговые диаграммы</button>
                        <button type="button" id="barsBtn" class="btn btn-outline-secondary" onClick='showBars()'>Столбцы</button>
                    </div>''', "utf-8"))
                 # Круговые диаграммы - начало
                self.wfile.write(bytes('''
                    <div id='circles' class="container-fluid">
                        <div class="row d-flex justify-content-center">''', "utf-8"))  
                labels = 'Просрочено', 'Не просрочено'
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
                # Круговые диаграммы - конец
                # self.wfile.write(bytes("<div>%s</div>" % htmlDate, "utf-8"))
                # self.wfile.write(bytes("<div>Всего: %s</div>" % query_components['total'], "utf-8"))
                # self.wfile.write(bytes("<div>Просрочено: %s</div>" % query_components['outTerm'], "utf-8"))
                # self.wfile.write(bytes("<div>Не просрочено: %s</div>" % query_components['notOutTerm'], "utf-8"))
                # # self.wfile.write(bytes("<p>message: %s</p>" % message, "utf-8"))
                # self.wfile.write(bytes("</div>", "utf-8"))
                # self.wfile.write(bytes("</body></html>", "utf-8"))
                
                # График
                # plt.plot(x1, y1, color='b', label='Всего')
                # plt.bar(x1, y2, bar_width,
                # alpha=opacity,
                # color='g',
                # label='За день')
                # plt.legend()
                # plt.show()

myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
