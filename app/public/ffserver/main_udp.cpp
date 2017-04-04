#include <stdio.h>
#include <opencv2/opencv.hpp>
#include <opencv2/highgui/highgui.hpp>

#include <iostream>
#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <stdlib.h>

#include <unistd.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>

#include <ctype.h>

//#include "ThreadClient.h"
using namespace std;
using namespace cv;
void drawTarget(Mat &ground, Rect& target);
void drawBound (Mat &ground,Scalar color);
int main(int argc, char *argv[])
{
    if(argc < 7) {
        printf("Usage: %s [media source] [grab data delaytime] [port] [destination ip] [witdh] [height] [encode quality]\r\n",argv[0]);
        exit(1);
    }
    for(int i=1; i<argc; i++){
        printf("  argv[%d]:%s\r\n",i,argv[i]);
    }
    string link(argv[1]);
    int delayTime = atoi(argv[2]);
    cv::VideoCapture vcap;
    //string link(argv[1]);

    int recvUdpSocket;
    struct sockaddr_in receiverServerAddr;

    recvUdpSocket = socket(PF_INET, SOCK_DGRAM, 0);
    receiverServerAddr.sin_family = AF_INET;
    receiverServerAddr.sin_port = htons(atoi(argv[3]));
    receiverServerAddr.sin_addr.s_addr = inet_addr(argv[4]);
    memset(receiverServerAddr.sin_zero, '\0', sizeof receiverServerAddr.sin_zero);
    socklen_t addr_size = sizeof receiverServerAddr;

    cv::Mat dst;
    char cmd[1024];
    sprintf(cmd,"/home/hainh/ffmpeg-3.2/ffmpeg -i udp://localhost:%d -tune zerolatency -vcodec libvpx-vp9 http://localhost:8092/feed1.ffm",atoi(argv[3]));
    printf("CMD: %s\r\n",cmd);
    //std::thread ffmpeg(system,cmd);
    //ffmpeg.detach();
    printf("Create feed ok\r\n");
//    int witdh = 0;
//    int heigh = 0;
    while(1 ){
        if (!vcap.read(dst)){
            std::cout << "No frame" << std::endl;
            if(strcmp("0",link.c_str()) == 0)
                vcap.open(0);
            else
                vcap.open(link);

            if(!vcap.set(CAP_PROP_FRAME_WIDTH,atoi(argv[5]))) printf("Set Width failed\r\n");
            if(!vcap.set(CAP_PROP_FRAME_HEIGHT,atoi(argv[6]))) printf("Set Height failed\r\n");
            printf("Camera HD [%.2fx%.2f]@%.2f\r\n",vcap.get(CAP_PROP_FRAME_WIDTH),vcap.get(CAP_PROP_FRAME_WIDTH),vcap.get(CAP_PROP_FPS));
            continue;
//            if(witdh == 0) witdh = vcap.get(CV_CAP_PROP_FRAME_WIDTH);
//            if(heigh == 0) heigh = vcap.get(CV_CAP_PROP_FRAME_HEIGHT);
            //dst = cv::Mat(witdh,heigh,CV_8SC3,cv::Scalar::all(0));
        }

	//printf("Getting data\r\n");
        //vcap.read(dst);
        std::vector<uchar>outbuf;
        std::vector<int> params;
        params.push_back(CV_IMWRITE_JPEG_QUALITY);
        params.push_back(atoi(argv[7]));
        // drawBound(dst,cv::Scalar(255,255,255));
        //cv::imencode(".jpg", dst, outbuf, params);
        long outlen = outbuf.size();
        sendto(recvUdpSocket,(unsigned char*)(&outbuf[0]),outlen,0,(struct sockaddr *)&receiverServerAddr,addr_size);
        cv::imshow("DATA", dst);
        cv::waitKey(delayTime);
    }
    return 0;
}
void drawTarget(Mat &ground, Rect& target){
	int length = 20;
	Point upL(target.x,target.y);
	Point upLdx(target.x + length, target.y);
	Point upLdy(target.x, target.y + length);

	Point upR(target.x + target.width, target.y);
	Point upRdx(target.x + target.width - length, target.y);
	Point upRdy(target.x + target.width, target.y + length);

	Point downL(target.x, target.y + target.height);
	Point downLdx(target.x + length, target.y + target.height);
	Point downLdy(target.x, target.y + target.height - length);

	Point downR(target.x + target.width, target.y + target.height);
	Point downRdx(target.x + target.width - length, target.y + target.height);
	Point downRdy(target.x + target.width, target.y + target.height - length);

	Point center(target.x + target.width / 2, target.y + target.height / 2);
	Scalar colorBound(0, 0, 0);
	Scalar colorCenter(0, 0, 0);
	line(ground, upL, upLdx, colorBound, 3, 8, 0);
	line(ground, upL, upLdy, colorBound, 3, 8, 0);

	line(ground, upR, upRdx, colorBound, 3, 8, 0);
	line(ground, upR, upRdy, colorBound, 3, 8, 0);

	line(ground, downL, downLdx, colorBound, 3, 8, 0);
	line(ground, downL, downLdy, colorBound, 3, 8, 0);

	line(ground, downR, downRdx, colorBound, 3, 8, 0);
	line(ground, downR, downRdy, colorBound, 3, 8, 0);

}
void drawBound (Mat &ground,Scalar color){
    int length = ground.rows / 20 ;
    cv::Rect target;
    target.x = ground.cols * 0.2;
    target.y = ground.rows * 0.2;
    target.width = ground.cols - 2 * target.x;
    target.height = ground.rows - 2 * target.y;
	Point upL(target.x,target.y);
	Point upLdx(target.x + length, target.y);
	Point upLdy(target.x, target.y + length);

	Point upR(target.x + target.width, target.y);
	Point upRdx(target.x + target.width - length, target.y);
	Point upRdy(target.x + target.width, target.y + length);

	Point downL(target.x, target.y + target.height);
	Point downLdx(target.x + length, target.y + target.height);
	Point downLdy(target.x, target.y + target.height - length);

	Point downR(target.x + target.width, target.y + target.height);
	Point downRdx(target.x + target.width - length, target.y + target.height);
	Point downRdy(target.x + target.width, target.y + target.height - length);

	Point center(target.x + target.width / 2, target.y + target.height / 2);

	Point centerUp(center.x,center.y - length / 4 -  length);
	Point centerUp_(center.x,center.y - 2* length / 4 - length);
	Point centerDown(center.x,center.y + length / 4+ length);
	Point centerDown_(center.x,center.y + 2* length / 4+ length);

	Point centerR(center.x + length / 4+ length,center.y);
	Point centerR_(center.x + 2* length / 4+ length,center.y);
	Point centerL(center.x - length / 4- length,center.y);
	Point centerL_(center.x - 2* length / 4- length,center.y);
	//Scalar colorBound(0, 0, 0);
	//Scalar colorCenter(0, 0, 0);
	line(ground, upL, upLdx, color, 3, 8, 0);
	line(ground, upL, upLdy, color, 3, 8, 0);

	line(ground, upR, upRdx, color, 3, 8, 0);
	line(ground, upR, upRdy, color, 3, 8, 0);

	line(ground, downL, downLdx, color, 3, 8, 0);
	line(ground, downL, downLdy, color, 3, 8, 0);

	line(ground, downR, downRdx, color, 3, 8, 0);
	line(ground, downR, downRdy, color, 3, 8, 0);

	circle(ground, center, length , color, 3, 8, 0);

	line(ground,centerUp,centerUp_,color,3,8,0);
	line(ground,centerDown,centerDown_,color,3,8,0);
	line(ground,centerR,centerR_,color,3,8,0);
	line(ground,centerL,centerL_,color,3,8,0);

}

// g++ -I/home/pi/Desktop/opencv_rpibuild/include -L/home/pi/Desktop/opencv_rpibuild/lib -lopencv_core -lopencv_video -lopencv_videostab -lopencv_highgui -lopencv_videoio -lopencv_imgproc -lopencv_imgcodecs  main_udp.cpp -o main_udp

