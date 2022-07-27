
#z::
Send ^s
Send ^s
reload
return

CoordMode, Mouse, Screen
CoordMode, Pixel, Screen

resetMap() {
  WinActivate Liftoff
  sleep 100
  send {Esc}
  MouseMove 970, 570
  Sleep 10
  Click
  MouseMove 1111, 560 ; change y when the number of tracks changes
  Sleep 10
  Click
  MouseMove 970, 560 ; change y when the number of tracks changes
  Sleep 10
  Click
  MouseMove 890, 660
  Sleep 100
  Click
  MouseMove 970, 410
  Sleep 10
  Click
  Sleep 10
  Click

}

F1::resetMap()
