from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urllib
import matplotlib.pyplot as plt
import json
from urllib.parse import unquote
import numpy as np
import datetime

hostName = "localhost"
hostPort = 8002

class MyServer(BaseHTTPRequestHandler):
    def createCircleDiagsBlock(self, data):
        # html_text = '''<div id='circles' class="container-fluid">
        #                 <div class="row d-flex justify-content-center">'''
        html_text = ''
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

            html_text += '''<div class="col-xxl-6 col-12 text-center pb-5">
                    <h3 class = 'empl-name'>%s</h3>
                    <div>%s</div>
                    <div>Всего: %s</div>
                    <div>Просрочено: %s</div>
                    <div>Не просрочено: %s</div>
                    <div>___________________________________</div>
                </div>''' %(employee['fio'],
                htmlDate,
                employee['taskCount'],
                employee['expiredCount'],
                str(notExpiredCount))            
        # html_text += "</div></div>"
        return html_text

    def createBarsDiagsBlock(self, data):
        # html_text = '''<div id='bars' class="container-fluid d-none">
        #                 <div class="row d-flex justify-content-center">'''
        html_text = ''             
        for employee in data:
            n_groups = 1
            labels = (employee['fio'])
            total_tasks = (employee['taskCount'])
            out_term_tasks = (employee['expiredCount'])
            fig, ax = plt.subplots()
            index = np.arange(n_groups)
            bar_width = 0.1
            opacity = 0.8

            rects1 = plt.bar(index, total_tasks, bar_width,
                alpha=opacity,
                color='g',
                label='Всего задач')

            rects2 = plt.bar(index + bar_width, out_term_tasks, bar_width,
                alpha=opacity,
                color='r',
                label='Просрочено')

            plt.ylabel('Количество задач')
            plt.title('')
            plt.xticks([1], [''])
            plt.legend()

            plt.tight_layout()
            plt.savefig("temp.html", format="svg")
            with open('temp.html', 'r') as g:
                htmlDate = g.read()

            notExpiredCount = int(employee['taskCount']) - int(employee['expiredCount'])
            html_text += '''
                <div class="col-xxl-6 col-12 text-center pb-5">
                    <h3 class = 'empl-name'>%s</h3>
                    <div>%s</div>
                    <div>Всего: %s</div>
                    <div>Просрочено: %s</div>
                    <div>Не просрочено: %s</div>
                    <div>___________________________________</div>
                </div>
                ''' % (
                employee['fio'],
                htmlDate,
                employee['taskCount'],
                employee['expiredCount'],
                str(notExpiredCount))        

        # html_text += "</div></div>"
        return html_text
    
    def createTasksCountPerDayBlock(self, data):
        # html_text = '''<div id='tasksPerDay' class="container-fluid d-none">
        #                 <div class="row d-flex justify-content-center">'''
        html_text = ''
        for employee in data:
            if len(data) == 1:
                fig, ax = plt.subplots()
            else:
                fig, ax = plt.subplots(figsize=(15,8))
            dates = [datetime.datetime.strptime(tmp['date'].split('T')[0], "%Y-%m-%d").date() for tmp in employee['emplTasksPerDayCount']]
            tasksCounts = [tmp['count'] for tmp in employee['emplTasksPerDayCount']]
            totalTasksCounts = []
            currentSum = 0
            for i in range(len(tasksCounts)):
                currentSum += tasksCounts[i]
                totalTasksCounts.append(currentSum)
            
            bar_width = 1
            opacity = 0.8

            
            plt.plot(dates, totalTasksCounts, color='b', label='Всего')
            plt.bar(dates, tasksCounts, bar_width,
            alpha=opacity,
            color='g',
            label='За день')
            
            plt.legend()
            plt.xticks(rotation=20)
            plt.savefig("temp.html", format="svg")
            with open('temp.html', 'r') as g:
                htmlDate = g.read()

            html_text += '''<div class="tasks-count-column col-12 text-center pb-5">
                    <h3 class = 'empl-name'>%s</h3>
                    <div>%s</div>
                    
                </div>''' %(employee['fio'],
                htmlDate)            
        # html_text += "</div></div>"
        return html_text

    def do_GET(self):
        
        query = unquote(urllib.parse.urlparse(self.path).query)
        if (query):
            query_components = dict(qc.split("=") for qc in query.split("&"))
            if (query_components['operation']=='tasksReport'):
                data = json.loads(str(query_components['employeesData']))
               
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                # print('''asda'''%data[0]['fio'])
                self.wfile.write(bytes('''<html>
                <meta charset = "utf-8"/>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">                    <title>Количественный отчет производительности</title>
                    <script type="text/javascript" src="http://ajax.microsoft.com/ajax/jquery/jquery-1.4.2.min.js"></script> 
                    <script>
                        function hideAll() {
                            console.log('hideAll')

                            $('#circleBtn').removeClass('btn-outline-info')
                            $('#barsBtn').removeClass('btn-outline-info')
                            $('#tasksPerDayBtn').removeClass('btn-outline-info')

                            $('#circleBtn').addClass('btn-outline-secondary')
                            $('#barsBtn').addClass('btn-outline-secondary')
                            $('#tasksPerDayBtn').addClass('btn-outline-secondary')

                            $('#circles').addClass('d-none')
                            $('#bars').addClass('d-none')
                            $('#tasksPerDay').addClass('d-none')
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

                        function showTasksPerDay() {
                            console.log('showTasksPerDay')

                            hideAll()
                            $('#tasksPerDay').removeClass('d-none')
                            $('#tasksPerDayBtn').addClass('btn-outline-info')
                        }
                    </script>
                </head>
                <body>
                    <div class = "text-center pb-5">
                        <h2 class='mb-2'>Отчет производительности</h2>
                        <h3 id='oneEmplName' class='mb-3 d-none'>%s</h3>
                        <div id = "btnsPanel">
                        <button type="button" id="circleBtn" class="btn btn-outline-info" onClick='showCircles()'>Круговые диаграммы</button>
                        <button type="button" id="barsBtn" class="btn btn-outline-secondary" onClick='showBars()'>Столбцы</button>
                        <button type="button" id="tasksPerDayBtn" class="btn btn-outline-secondary" onClick='showTasksPerDay()'>Выполненные задачи по дням</button>
                        </div>
                    </div>'''%(data[0]['fio']), "utf-8"))  

                if len(data) == 1:
                    self.wfile.write(bytes('''<div class="container-fluid">
                            <div class="row d-flex justify-content-center">''', "utf-8")) 
                    circleDiagsBlock = self.createCircleDiagsBlock(data)
                    self.wfile.write(bytes(circleDiagsBlock, "utf-8")) 

                    tasksCountPerDayBlock = self.createTasksCountPerDayBlock(data)
                    self.wfile.write(bytes(tasksCountPerDayBlock, "utf-8"))    
                
                    barsDiagsBlock = self.createBarsDiagsBlock(data)
                    self.wfile.write(bytes(barsDiagsBlock, "utf-8"))
                    
                    self.wfile.write(bytes("</div></div>", "utf-8")) 

                    self.wfile.write(bytes('''
                        <script> 
                            document.querySelector('#btnsPanel').classList.add('d-none');

                            emplNames = document.querySelectorAll('.empl-name');
                            [].forEach.call(emplNames, function(element, index, list) { 
                                element.classList.add('d-none');
                            });

                            document.querySelector('.tasks-count-column').classList.add('col-xxl-6');
                            document.querySelector('#oneEmplName').classList.remove('d-none');
                            
                        </script>''', "utf-8"))
                else:
                    circleDiagsBlock = '''<div id='circles' class="container-fluid">
                            <div class="row d-flex justify-content-center">'''
                    circleDiagsBlock += self.createCircleDiagsBlock(data)
                    circleDiagsBlock += "</div></div>"
                    self.wfile.write(bytes(circleDiagsBlock, "utf-8"))  
                
                    barsDiagsBlock = '''<div id='bars' class="container-fluid d-none">
                            <div class="row d-flex justify-content-center">'''
                    barsDiagsBlock += self.createBarsDiagsBlock(data)
                    barsDiagsBlock += "</div></div>"
                    self.wfile.write(bytes(barsDiagsBlock, "utf-8"))

                    tasksCountPerDayBlock = '''<div id='tasksPerDay' class="container-fluid d-none">
                            <div class="row d-flex justify-content-center">'''
                    tasksCountPerDayBlock += self.createTasksCountPerDayBlock(data)
                    tasksCountPerDayBlock += "</div></div>"
                    self.wfile.write(bytes(tasksCountPerDayBlock, "utf-8"))

                self.wfile.write(bytes("</body></html>", "utf-8"))
        
                
myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))