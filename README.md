# Introduction
##Why to get
3D scanning technology can be useful in the following activities: prototyping and design, reverse engineering, in-line manufacturing inspection and/or quality control. In this case, this Specific Enabler is very useful in manufacturing environments where dimensional quality requirements are very demanding, without forgetting the need to perform dimensional controls as fast as possible without slowing the production rhythms. Moreover, it provides a fast way of performing quality controls and an intuitive visualization decision support system to determine if the analysed manufactured part must be accepted or rejected.
##What you get
There are two open source components provided by the Specific Enabler: storage and visualization. For the visualization part, it could work with a optical 3D non-contact scanning sensor of which output are displayed in the web viewer. Regarding the storage component, there are several options: documents database or relational ones (e.g.MySql Server). The web based design allows this enabler to be integrated easily and compliant with the RESTful API.
# Build and Install
The 3Dscan SE runs in a servlet container such as Tomcat, thus it does not depend on a particular operating system flavor. Before running the code, first please install Java (JRE 7) and MySQL server 5.5. More specifically, see the [step by step installation guide](https://github.com/datapixel/3DScan/blob/master/InstallationGuide.md).
#Usage example
The interface of the SE complies with the RESTful API including: Upload new 3D file, Update the existed file, Delete file, View the file in the format of point cloud or mesh.
Before verifying the REST API of these functionalities, we suggest installing the REST API client in Chrome or Firefox web browser.
+ For database management (details see link):
  * Send GET to view the database structure:
  
    > http://{server Ip: port}/sqlrest/webgl/
  
  * Send GET to view the specific image file id and its physical local path
  
    > http://{server Ip: port}/sqlrest/webgl/{image object id}

+ For 3D file operations:
  * Send POST with the 3D file to upload a new file:
  
    > http://{server Ip: port}/{your application root}/post/upload/{image object id}

  * Send POST with the 3D file to update a new file:
  
    > http://{server Ip: port}/{your application root}/post/update/{image object id}

  * Send DELETE to delete the specific image:
  
    > http://{server Ip: port}/{your application root}/delete/{image object id}

  * Display one existed 3D file stored:
  
    > http://{server Ip: port}/{your application root}/get/id_canvas/1{image object id}

    The return data is a JavaScript code which could be integrated in any web page to display the 3D file detailed in the   next section.
    E.g. the usage of displaying the 3D file as aforementioned interfaces, could be integrated into the JavaScript code:
    ```javascrpt
    <script src="http:// localhost{your host}:8080{your port}/FitmanGL{your application root}/rest/get/id_canvas/{image object id added in the database}" type="text/javascript"></script>
    ```
    
#License
  Under the FreeBSD License, which allows maximum reuse, contribution and the freedom of commercialization for 3rd parties. Please check the specific terms and conditions linked to this open source license at https://www.freebsd.org/copyright/freebsd-license.html


