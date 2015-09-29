#!/sbin/runscript

# Make sure you set USER and GROUP below to the correct values.
# The command below assumes you've setup a config in /etc/remtroll
# You can drop that from the command if you haven't.

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
    local USER="root"
    local GROUP="wheel"
    if [ ! -f /etc/init.d/sysfs ]; then
	USEROPT="--chuid"
    fi
    ebegin "Starting RemTroll"
    start-stop-daemon --start --exec "bash" --background --pidfile /etc/remtroll/remtroll.pid \
    	$USEROPT $USER:$GROUP -- -c "exec remtroll /etc/remtroll/remtroll.cfg > /var/log/remtroll.log"
    eend $?
}

stop() {
    ebegin "Stopping RemTroll"
    start-stop-daemon --stop --retry 120 --pidfile /etc/remtroll/remtroll.pid
    eend $?
}
