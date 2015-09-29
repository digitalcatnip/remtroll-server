#!/sbin/runscript

depend() {
    need net localmount
    use dns
}

start() {
#    if [ "${RC_CMD}" = "restart" ];
#    then
	#do something
#    fi
    
    local USEROPT="--user"
    if [ ! -f /etc/init.d/sysfs ]; then
	USEROPT="--chuid"
    fi
    ebegin "Starting RemTroll"
    start-stop-daemon --start --exec "bash" --background --pidfile /etc/remtroll/remtroll.pid \
    	$USEROPT catnip:catnip -- -c "exec remtroll /etc/remtroll/remtroll.cfg > /catnip/logs/remtroll.log"
    eend $?
}

stop() {
    ebegin "Stopping RemTroll"
    start-stop-daemon --stop --retry 120 --pidfile /etc/remtroll/remtroll.pid
    eend $?
}
