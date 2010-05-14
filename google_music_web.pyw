#!/usr/bin/env python
#coding=utf-8

from xml.dom import minidom
import urllib
import httplib
import re
import os
import time
import sys
import hashlib

fsock = open('error.log', 'a')
fsock.write(time.strftime('%Y-%m-%d %X',time.localtime())+"\n")
fsock.flush()
sys.stderr = fsock

pid = open('pid','w')
pid.write(str(os.getpid()))
pid.close()

foobar2000_path = "d:/foobar2000/foobar2000"
input_url = sys.argv[1]
playlist_url = urllib.urlopen(input_url)
xmldom = minidom.parse(playlist_url)
playlist_url.close()
songs = xmldom.getElementsByTagName('song')
length = len(songs)
default_key = "c51181b7f9bfce1ac742ed8b4a1ae4ed"

def google_download(id):
    song_url = "http://www.google.cn/music/top100/musicdownload?id="+id
    try:
        song_pagedata = urllib.urlopen(song_url).read()
    except Exception:
        return False
    match_url = re.search("(?<=url\?q=).*?(?=&amp;ct)",song_pagedata)
    if match_url:
        download_url = urllib.unquote(match_url.group())
        return download_url
    else:
        return False

def google_stream(id):
    sig = hashlib.md5(default_key+id)
    sig = sig.hexdigest()
    xml_url = "http://www.google.cn/music/songstreaming?id="+id+"&sig="+sig+"&output=xml"
    try:
        xml_url = urllib.urlopen(xml_url)
        xmldom_stream = minidom.parse(xml_url)
        xml_url.close()
    except Exception:
        return False
    download_url = xmldom_stream.getElementsByTagName('songUrl')[0].firstChild.data
    return download_url

def updateplaylist():
    playlist = open("playlist/google.m3u","w")

    song_iter = iter(songs)
    retry = False
    trytimes = 0
    start = 0
    
    while True:
        if retry != True or trytimes > 3:
            trytimes = 0
            try:
                song = song_iter.next()
                percent = open("percent.txt","w")
                start += 1
                percent.write(str(start)+'/'+str(length))
                percent.close()
            except StopIteration:
                break
            except Exception:
                pass
        id = song.firstChild.firstChild.data

        download_url = google_stream(id)
        if download_url:
            playlist.write(download_url+"\n")
            retry = False
        else:
            trytimes += 1
            if trytimes > 3:
                log_file = open('google_log.txt','a')
                log_file.write(time.strftime('%Y-%m-%d %X',time.localtime())+"\n")
                log_data = song.childNodes[1].firstChild.data+": "+id+"\n"
                log_file.write(log_data.encode('utf-8'))
                log_file.close()
            retry = True 
            time.sleep(1)
    try:
        percent = open("percent.txt","w")
        percent.write("1")
        percent.close()
        playlist.close()
    except Exception:
        pass
    time.sleep(5)
    if os.path.exists('percent.txt'):
        os.remove('percent.txt')

updateplaylist()
os.popen('start '+foobar2000_path+' /playlist:"Google"','r')
time.sleep(4)
os.popen('start '+foobar2000_path+' /play "playlist/empty.fpl"','r')
time.sleep(2)
if os.path.exists("playlist/temp.fpl"):
    os.popen('start '+foobar2000_path+' /add "playlist/temp.fpl"','r')
os.popen('start '+foobar2000_path+' /add "playlist/google.m3u"','r')
time.sleep(2)
os.popen('start '+foobar2000_path+' /play','r')
os.popen('start '+foobar2000_path+' /hide','r')

while True:
    time.sleep(10000)
    updateplaylist()
    os.popen('start '+foobar2000_path+' /playlist:"Google"','r')
    time.sleep(2)
    os.popen('start '+foobar2000_path+' /play "playlist/empty.fpl"','r')
    time.sleep(2)
    if os.path.exists("playlist/temp.fpl"):
        os.popen('start '+foobar2000_path+' /add "playlist/temp.fpl"','r')
    os.popen('start '+foobar2000_path+' /add "playlist/google.m3u"','r')
    time.sleep(2)
    os.popen('start '+foobar2000_path+' /play','r')
    time.sleep(1)
