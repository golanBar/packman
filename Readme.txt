All javascript packman project.
written by Golan bar
11/01/16

Fixed issues:
 - 13.12.15 sometimes ghosts don't switch into escape mode after packman eats a pill. inconsistent.
 - 13.12.15 level 5 can't be completed. for now, the esc button can be used instead.

Known issues:
 - in level 4, ghosts may take the long way home after packman was killed. 
  
Running the game:
 - Install a servlet container such as a Tomcat server(https://www.tecmint.com/install-apache-tomcat-in-ubuntu/)
 - Copy the packman flders and files to /opt/tomcat/webapps/ROOT/packman/
 - Run Tomcat server locally 
 - Invoke the game in the broswer with this link  - http://localhost:8080/packman/index.jsp

