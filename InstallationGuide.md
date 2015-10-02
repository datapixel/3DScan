# Step by step installation guide
## System Requirements
+ Java version 7 .
+ Apache Tomcat servlet container version 6.
+ MySQL server 5.5.
+ TCP port set in Tomcat must be reachable.

## Building from source
Get the code from the Github:
```
git clone https://github.com/datapixel/3DScan.git
```
To build a standalone JAR:

1. Install any Java IDE, such as Eclipse Java EE Juno or later version.

2. Import the project as [steps to import project in Eclipse here](http://agile.csc.ncsu.edu/SEMaterials/tutorials/import_export/).

3. Export jar file for the deployment in Tomcat, as the instruction [here](https://www.cs.utexas.edu/~scottm/cs307/handouts/Eclipse%20Help/jarInEclipse.htm).

## Installing steps
1.	Install Java version 7 if there is no Java configured in the PC.

2.	Install Apache Tomcat servlet container version 6.

3.	Download [MySQL database configuration package here](http://catalogue.fitman.atosresearch.eu/sites/default/files/storage/enablers/SQL_Config.zip),
 and extract it. 

4.	Install MySQL server 5.5 and create the database called FITMAN with the script provided in the extracted folder above. Meanwhile to ensure there is `mysql-connector-java-5.1.31-bin.jar` in the `bin directory of Tomcat` in order to connect to MySQL, if not copy the jar file from the extracted `SQL_Config` folder.

5.	Extract `sqlrest.zip` files from the `SQL_Config folder`, and copies the `sqlrest folder` to the `{TomcatRoot}/webapps directory`.

6.	Then configure the `sqlrestconfig.xml` in the extracted `sqlrest folder` with your own MySQL database `username` and `password` as the following xml file:
  ```xml
<?xml version="1.0" encoding="UTF-8"?>
	<sqlrestconf>
	  <database>
	    <!--	    
	    Hypersonic DB in process with the example Database	    
	    -->
	    <jdbc-driver-class>com.mysql.jdbc.Driver</jdbc-driver-class>
	    <database-url>jdbc:mysql://localhost:3306/fitman</database-url>
	    <user>your username</user>
	    <password>your password</password>
	    <!--	    
	    External Hypersonic DB	    
	    <jdbc-driver-class>org.hsqldb.jdbcDriver</jdbc-driver-class>
	    <database-url>jdbc:hsqldb:hsql://localhost</database-url>
	    <user>sa</user>
	    <password></password>
	    -->
	    <!-- 	    
	    Inet Sprinta Driver for MS SQL Server 	    
	    <jdbc-driver-class>com.inet.tds.TdsDriver</jdbc-driver-class>
	    <database-url>jdbc:inetdae7a:localhost:1433</database-url>
	    -->
	  </database>
	</sqlrestconf>
  ```
7.  Deploy the `jar` file exported in the step 3 above, and copy it into the `{TomcatRoot}/webapps directory` as well.

8.  Note, configure `config.properties` in the folder of `{Tomcat Root}/webapps/your deployed jar folder name/WEB-INF/classes/` after the deployment. Change the lines noted in the file with your own setting of file location and web host path as shown in the following format:	
  ```
   # To change this template, choose Tools | Templates
   # and open the template in the editor.
   url_threejs = http: //cdnjs.cloudflare.com/ajax/libs/three.js/r67/three.min.js
   url_jquery = http: //ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
   url_bbdd = http: //localhost:8080/sqlrest/webgl/
   url_resource_base = http: //localhost:8080/Fitman3DImages/ 
   dir_base = C:/FITMAN_TEST_DATA/
  ```
9.  Create the local image storage folder as the `dir_base` value in the `config.properties` above, which could be any path outside the tomcat webapps directory.

10.  It is necessary mapping the local path to the `URL (url_resource_base value above)` in TOMCAT, thus add the following example code in the `{Tomcat Root}/conf/server.xml` between the Host tags:
  ```xml
  <Context docBase="C:/FITMAN_TEST_DATA/" path="/Fitman3DImages"/>
  ```
11.  Run/Restart Tomcat.

12.  More detailed installation and testing steps could be found in the [FITMAN SE admin guideV1.docx here](http://catalogue.fitman.atosresearch.eu/sites/default/files/storage/enablers/FITMAN%20SE%20admin%20guideV1.docx) and the [FITMAN SE user guideV1.docx here](http://catalogue.fitman.atosresearch.eu/sites/default/files/storage/enablers/FITMAN%20SE%20user%20guideV1.docx).
Also you could refer to the [video for deployment here](https://drive.google.com/open?id=0B8xLIJs6LhWbbk1xZ0JXSUl1enM&authuser=0). 



