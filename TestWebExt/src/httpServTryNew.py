from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib
import matplotlib.pyplot as plt
import json
from urllib.parse import unquote
import numpy as np

hostName = "localhost"
hostPort = 8002

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query = unquote(urllib.parse.urlparse(self.path).query)
        if (query):
            query_components = dict(qc.split("=") for qc in query.split("&"))
            if (query_components['operation']=='tasksReport'):
                data = json.loads(str(query_components['employeesData']))
               
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
                    <div class = "text-center pb-5">
                        <h2>Отчет производительности</h2>
                    </div>   ''', "utf-8"))  

                # Круговые диаграммы - начало
                self.wfile.write(bytes('''
                    <div class="container-fluid circle-diags">
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

                # data to plot
                n_groups = len(employee)
                labels_list = []
                total_tasks_list = []
                out_term_tasks_list = []
                for employee in data:
                    labels_list.append(employee['fio'])
                    total_tasks_list.append(employee['taskCount'])
                    out_term_tasks_list.append(employee['expiredCount'])

                labels = tuple(labels_list)
                labels = ('a', 'a', 'a', 'a', 'b')
                total_tasks = tuple(total_tasks_list)
                out_term_tasks = tuple(out_term_tasks_list)
                print(labels, total_tasks, out_term_tasks)

                # create plot
                fig, ax = plt.subplots()
                index = np.arange(n_groups)
                bar_width = 0.35
                opacity = 0.8

                rects1 = plt.bar(index, total_tasks, bar_width,
                alpha=opacity,
                color='r',
                label='Просрочено')

                rects2 = plt.bar(index + bar_width, out_term_tasks, bar_width,
                alpha=opacity,
                color='g',
                label='Всего задач')

                plt.xlabel('Сотрудники')
                plt.ylabel('Количество задач')
                plt.title('')
                plt.xticks(index + bar_width, labels)
                plt.legend()

                plt.tight_layout()
                plt.savefig("temp.html", format="svg")

                with open('temp.html', 'r') as g:
                    htmlDate = g.read()
                self.wfile.write(bytes('''
                    <div class="col-xl-4 col-lg-6 col-12 text-center pb-5">
                        <div>%s</div>
                        <div>___________________________________</div>
                    </div>''' % htmlDate, "utf-8")) 


                # Столбцы - начало
          
                # self.wfile.write(bytes('''
                #     <div class="container-fluid bars-diags">
                #         <div class="row d-flex justify-content-center">''', "utf-8"))  

                # n_groups = len(employee)
                # labels_list = []
                # total_tasks_list = []
                # out_term_tasks_list = []
                # for employee in data:
                #     labels_list.append(employee['fio'])
                #     total_tasks_list.append(employee['taskCount'])
                #     out_term_tasks_list.append(employee['expiredCount'])

                
                # labels = tuple(labels_list)
                # total_tasks = tuple(total_tasks_list)
                # out_term_tasks = tuple(out_term_tasks_list)
                # print(labels, total_tasks, out_term_tasks)

                # fig, ax = plt.subplots()
                # index = np.arange(n_groups)
                # bar_width = 0.35
                # opacity = 0.8

                # rects1 = plt.bar(index, total_tasks, bar_width,
                # alpha=opacity,
                # color='r',
                # label='Просрочено')

                # rects2 = plt.bar(index + bar_width, out_term_tasks, bar_width,
                # alpha=opacity,
                # color='g',
                # label='Всего задач')

                # plt.xlabel('Сотрудники')
                # plt.ylabel('Количество задач')
                # plt.title('')
                # plt.xticks(index + bar_width, labels)
                # plt.legend()
                # plt.tight_layout()
                
                # plt.savefig("temp.html", format="svg")

                # with open('temp.html', 'r') as g:
                #     htmlDate = g.read()
                # self.wfile.write(bytes('''
                #     <div class="col-xl-4 col-lg-6 col-12 text-center pb-5">
                #         <div>%s</div>
                #         <div>___________________________________</div>
                #     </div>
                #     ''' % htmlDate, "utf-8")) 
                # self.wfile.write(bytes("</div></div>", "utf-8"))

                # Столбцы - конец
                
                self.wfile.write(bytes("</body></html>", "utf-8"))
                
myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))