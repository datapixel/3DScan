package com.innovalia;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;


@Path("/")
public class WebGLService {
	@GET
	@Path("/get/{canvas_id}/{object_id}")
    @Produces("text/Javascript")
    public String getWebGL(@PathParam("canvas_id") String canvasid, @PathParam("object_id") String objectid, @Context HttpServletRequest request) {
		ResourceBundle rb = ResourceBundle.getBundle("config");
		String url_threefile = rb.getString("url_threejs");
		String url_jquery = rb.getString("url_jquery");
        String ruta_file = getRuta(new StringBuilder(rb.getString("url_bbdd")).append(objectid).append("/").toString());
		String ruta_name = getRutaName(ruta_file);
        String resource_ruta_file = rb.getString("url_resource_base") + ruta_name;
		System.out.println("ruta_file_Origin: " + ruta_file);
				InputStream codigoStream = null;
		if (ruta_file.endsWith("stl")) {
			codigoStream = request.getServletContext().getResourceAsStream("/WEB-INF/resources/codigo.js");
		} else
		if (ruta_file.endsWith("r3d")||ruta_file.endsWith("txt")) {
			codigoStream = request.getServletContext().getResourceAsStream("/WEB-INF/resources/codigo_point.js");
		}
		
		com.innovalia.bbdd.code.ObjectFactory of =  new com.innovalia.bbdd.code.ObjectFactory();
		
		//com.innovalia.bbdd.code.Webgl oCode = of.createWebgl();
		//oCode.setCode(getStringFromInputStream(codigoStream, canvasid, url_threefile, ruta_file, url_jquery));
		//return oCode;
		
		return getStringFromInputStream(codigoStream, canvasid, url_threefile, resource_ruta_file, url_jquery);
    }
	
	private String getRuta(String ruta) {
		URL obj;
		try {
			obj = new URL(ruta);
		} catch (MalformedURLException e) {
			return null;
		}
			
		JAXBContext jaxbContext;
		try {
			jaxbContext = JAXBContext.newInstance(com.innovalia.bbdd.webgl.Webgl.class);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			com.innovalia.bbdd.webgl.Webgl oWebgl = (com.innovalia.bbdd.webgl.Webgl) jaxbUnmarshaller.unmarshal(obj);
			return oWebgl.getFile();
		} catch (JAXBException e) {
			return null;
		}		
	}
	
	private String getRutaName(String ruta) {
      return ruta.substring(ruta.lastIndexOf("/")+1);
	}
	
	private String getStringFromInputStream(InputStream is, String id_canvas, String url_threefile, String url_ruta_obj, String url_jquery) { 
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();
 
		String line;
		try {
 
			br = new BufferedReader(new InputStreamReader(is));
			//firstly read line by line var parameters and replace it with our params;			
			while ((line = br.readLine()) != null) {
				if ( line.startsWith("var")) {
					if ( line.startsWith("var ruta_lib")) {
						line = new StringBuilder("var ruta_lib = '").append(url_threefile).append("'; \n").toString();
					} else
					if ( line.startsWith("var ruta_jquery")) {
						line = new StringBuilder("var ruta_jquery = '").append(url_jquery).append("'; \n").toString();
					} else
					if ( line.startsWith("var ruta_obj")) {
						line = new StringBuilder("var ruta_obj = '").append(url_ruta_obj).append("'; \n").toString();
						System.out.println("var ruta_obj: " + line);
					} else
					if ( line.startsWith("var id_canvas")) {
						line = new StringBuilder("var id_canvas = '").append(id_canvas).append("'; \n").toString();
					}
				} else {
					break;					
				}
				sb.append(line);
			}
			//read the rest of the file
			while ((line = br.readLine()) != null) {
				sb.append(line);
				sb.append("\n");
			}
 
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
 
		return sb.toString(); 
	}
	
	@DELETE
	@Path("/delete/{object_id}")
    @Produces("application/xml")
    public String deleteWebGL(@PathParam("object_id") String objectid, @Context HttpServletRequest request) {
		ResourceBundle rb = ResourceBundle.getBundle("config");
		String ruta_file = getRuta(new StringBuilder(rb.getString("url_bbdd")).append(objectid).append("/").toString());
		
		File file = new File(ruta_file);

		if(file.delete()){
			String url = new StringBuilder(rb.getString("url_bbdd")).append(objectid).append("/").toString(); 
			URL obj;
			try {
				obj = new URL(url);				

				HttpURLConnection con;
				try {
					con = (HttpURLConnection) obj.openConnection();

					con.setRequestMethod("DELETE");
			 
					int responseCode = con.getResponseCode();
					if ( responseCode == 200 ) {
						return "<result>200</result>";
					} else {
						return "<result>403</result>";
						
					}
				} catch (IOException e) {}
			} catch (MalformedURLException e) {}
		}
		return "<result>1</result>";	 
	}
	
	@POST
	@Path("/post/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadFile(
		@FormDataParam("file") InputStream fileInputStream,
		@FormDataParam("file") FormDataContentDisposition contentDispositionHeader) {
		System.out.println("start uploadfile");
		ResourceBundle rb = ResourceBundle.getBundle("config");	 
		String filePath = rb.getString("dir_base") + contentDispositionHeader.getFileName();

		System.out.println("filePath=" + filePath);
		//save the file to the server
        if ( saveFile(fileInputStream, filePath) == 0 ) {
        	String url = rb.getString("url_bbdd");
        	
			URL obj;
			try {
				obj = new URL(url);				

				HttpURLConnection con;
				try {
					con = (HttpURLConnection) obj.openConnection();
					con.setDoOutput(true);
					con.setDoInput(true);
					con.setRequestMethod("POST");			 
					String urlParameters = "<resource><file>"+filePath+"</file></resource>";
					con.setRequestProperty("Content-Type", "application/xml"); 
					con.setRequestProperty("charset", "utf-8");
					con.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
					con.setUseCaches (false);

					DataOutputStream wr = new DataOutputStream(con.getOutputStream());
					wr.writeBytes(urlParameters);
					wr.flush();
					wr.close();
					con.disconnect();

		    		System.out.println("getResponseCode=" + con.getResponseCode());
					return "<result>200</result>";
					/*
					int responseCode = con.getResponseCode();
					if ( responseCode/100 == 2 ) {
						return "<result>0</result>";
					} else {
						return "<result>2</result>";						
					}*/
				} catch (IOException e) {}
			} catch (MalformedURLException e) {}
        }
 
		return "<result>403</result>"; 
    }

	
	@POST
	@Path("/post/update/{object_id}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String updateFile(@PathParam("object_id") String objectid,
		@FormDataParam("file") InputStream fileInputStream,
		@FormDataParam("file") FormDataContentDisposition contentDispositionHeader) {
		ResourceBundle rb = ResourceBundle.getBundle("config");	 
		String filePath = rb.getString("dir_base") + contentDispositionHeader.getFileName();
		 
		//save the file to the server
        if ( saveFile(fileInputStream, filePath) == 0 ) {
        	String url = new StringBuilder(rb.getString("url_bbdd")).append(objectid).append("/").toString();
    		
			URL obj;
			try {
				obj = new URL(url);				

				HttpURLConnection con;
				try {
					con = (HttpURLConnection) obj.openConnection();
					con.setDoOutput(true);
					con.setDoInput(true);
					con.setRequestMethod("POST");
			 
					String urlParameters = "<resource><file>"+filePath+"</file></resource>";
					con.setRequestProperty("Content-Type", "application/xml"); 
					con.setRequestProperty("charset", "utf-8");
					con.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
					con.setUseCaches (false);

					DataOutputStream wr = new DataOutputStream(con.getOutputStream());
					wr.writeBytes(urlParameters);
					wr.flush();
					wr.close();
					con.disconnect();
		    		System.out.println("getResponseCode=" + con.getResponseCode());

					return "<result>200</result>";

					
					/*int responseCode = con.getResponseCode();
					if ( responseCode/100 == 2 ) {
					} else {
						return "<result>2</result>";						
					}*/
				} catch (IOException e) {}
			} catch (MalformedURLException e) {}
        }
 
		return "<result>403</result>";
    }
 
    // save uploaded file to a defined location on the server
    private byte saveFile(InputStream uploadedInputStream,
            String serverLocation) {

		System.out.println("serverLocation=" + serverLocation);
        try {
            OutputStream outpuStream = new FileOutputStream(new File(serverLocation));
            int read = 0;
            byte[] bytes = new byte[1024];
 
            outpuStream = new FileOutputStream(new File(serverLocation));
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                outpuStream.write(bytes, 0, read);
            }
            outpuStream.flush();
            outpuStream.close();
    		System.out.println("saveFile ok");
            return 0;
        } catch (IOException e) {
    		System.out.println("saveFile.saveFile=" + e.getMessage());
 
        }
        return 1;
 
    }
}
