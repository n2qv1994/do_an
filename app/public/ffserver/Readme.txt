Em co the dung truc tiep cac file ffmpeg, ffserver, main_udp cua anh da gui
Neu 3 file chua co quyen thuc thi, dung lenh sudo chmod +x [ten file] de file co quyen thuc thi nhe
Con neu khi chay file ma bao loi thieu lib thi thu chay cac file cua em. co gang kiem duoc camera usb cang tot nhe, cu mua di roi hom toi anh tra tien :))
=============
1. Compile main_udp.cpp va khoi dong thanh file main_udp, em co the tim cach tu build tren C++ hoac dung lenh cua anh
command: g++ -I/[duong dan full co cac file include cua opencv] -L/[duong dan full chua tap cac lib cua opencv] -lopencv_core -lopencv_video -lopencv_videostab -lopencv_highgui -lopencv_videoio -lopencv_imgproc -lopencv_imgcodecs  main_udp.cpp -o main_udp 
vi du: g++ -I/home/pi/Desktop/opencv_rpibuild/include -L/home/pi/Desktop/opencv_rpibuild/lib -lopencv_core -lopencv_video -lopencv_videostab -lopencv_highgui -lopencv_videoio -lopencv_imgproc -lopencv_imgcodecs  main_udp.cpp -o main_udp
2. khoi dong ffserver
command: ffserver -f [ten file cau hinh]
vi du: ffserver -f ffserver_multicast.conf 
chu y: em co the sua file ffserver_multicast.conf anh da dua cho em de co the hieu cach su dung
3. khoi dong main_udp de gui du lieu udp vao mot cong dac biet nao do
 command: ./main_udp [media source] [grab data delaytime] [port] [destination ip] [witdh] [height] [encode quality] 
vi du: ./main_udp 0 1 8002 127.0.0.1 1280 720 55
 de biet chuong trinh da hoat dong, em co the dung ffplay de xem du lieu da duoc gui thanh cong thong qua lenh:
ffplay udp://127.0.0.1:8002
chu y: 
 - neu em chay chuong trinh tren may A, muon gui du lieu toi may B thi [destination ip] la chi chi cua may B
 - [media source] = 0 de chi dinh opencv lay du lieu tu camera bat ki cam vao pi
 - [witdh]: chieu rong frame muon cau hinh cho camera  
 - [height]: chieu dai frame muon cau hinh cho camera 
 - [encode quality]: chat luong nen hinh anh co gia tri trong khoang 0-63 
4. khoi dong ffmpeg de lay du lieu tu main_udp va gui cho ffserver
command: ffmpeg -i [du lieu tu camera] -vcodec [ten codec] [link feed cua ffserver]
vi du: ffmpeg -i udp://127.0.0.1:8002 -vcodec omx_h264_pi http://localhost:8081/feed1.ffm  
5. sau khi thuc hien 4 buoc thi co the xem streaming tren bat cu may tinh nao cung dai mang
command: ffplay rtsp://[streaming server ip]:8082/test.main
vi du: ffplay rtsp://[streaming server ip]:8082/test.main
6. cac test
Neu em co 2 may tinh thi cang tot
May A: raspberry pi
May B: may tinh con lai
----------------------
Test 01:
Gia su dia chi ip may B la 192.168.x.x
/dev/video0 la file xuat hien khi cam usb camera
Tren may A:
  ffserver -f ffserver_multicast.conf
  ffmpeg -i /dev/video0 -vcodec omx_h264_pi http://localhost:8081/feed1.ffm
chu y: em co the thay /dev/video0 bang bat cu file video nao
Tren may B:
  ffplay rtsp://192.168.x.x:8082/test.main
Phai nhin thay hinh anh stream moi thanh cong
----------------------
Test 02:
Tren may A:
  ./main_udp 0 1 8002 127.0.0.1 1280 720 55
Tren may A:
  ffplay udp://locahost:8002 
Phai nhin thay hinh anh stream moi thanh cong
----------------------
Test 03: 
Gia su dia chi ip may B la 192.168.x.x
Tren may A:
  ./main_udp 0 1 8002 192.168.x.x 1280 720 55
Tren may B:
  ffplay udp://192.168.x.x:8002 
Phai nhin thay hinh anh stream moi thanh cong
----------------------
Test 04:
Gia su dia chi ip may B la 192.168.x.x
Tren may A:
  ./main_udp 0 1 8002 127.0.0.1 1280 720 55
  ffserver -f ffserver_multicast.conf
  ffmpeg -i udp://127.0.0.1:8002 -vcodec omx_h264_pi http://localhost:8081/feed1.ffm
Tren may B:
  ffplay rtsp://192.168.x.x:8082/test.main
Phai nhin thay hinh anh stream moi thanh cong


ffmpeg -c:v h264_mmal -i <inputfile.mp4> -c:v h264_omx -c:a copy -b:v 1500k <outputfile.mp4>
ffmpeg -i /dev/video0 -c:v h264_omx -b:v 1500k http://localhost:8081/feed1.ffm

raspivid -n -w 720 -h 420 -fps 25 -vf -t 86400000 -b 1800000 -ih -o - | ffmpeg -i - -c:v h264_omx -b:v 1500k http://localhost:8081/feed1.ffm



ffmpeg -i input0 -i input1 -i input2 -i input3 -filter_complex \
"[0:v][1:v]hstack[top]; \
 [2:v][3:v]hstack[bottom]; \
 [top][bottom]vstack,format=yuv420p[v]; \
 [0:a][1:a][2:a][3:a]amerge=inputs=4[a]" \
-map "[v]" -map "[a]" -ac 2 output.mp4



-acodec copy -vcodec copy c:/abc.mp4




 ffmpeg -i 1.mp4 -i 2.mp4 -i 3.mp4 -i 5.mp4 -i 7.mp4 -filter_complex "nullsrc=size=720x480 [base]; [0:v] setpts=PTS-STARTPTS, scale=240x240 [upper]; [1:v] setpts=PTS-STARTPTS, scale=240x240 [upper]; [2:v] setpts=PTS-STARTPTS, scale=240x240 [upper]; [3:v] setpts=PTS-STARTPTS, scale=240x240 [lower]; [4:v] setpts=PTS-STARTPTS, scale=240x240 [lower]; [base][upper] overlay=shortest=1 [tmp1]; [tmp1][upper] overlay=shortest=1:x=240 [tmp2]; [tmp2][upper] overlay=shortest=1:x=480 [tmp3]; [tmp3][lower] overlay=shortest=1:y=240 [tmp4]; [tmp4][lower] overlay=shortest=1:x=480: y=240; [0:a][1:a][2:a][3:a][4:a]amerge=inputs=5[a] " -map "[a]" -c:v libx264 -ac 2 output.mp4
