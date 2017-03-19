#!/bin/sh
#
# remtroll_enable (bool):       Set to "NO" by default.
#                               Set it to "YES" to enable remtroll.

. /etc/rc.subr

name="remtroll"
rcvar="${name}_enable"
start_cmd="remtroll_start"

pidfile="/var/run/${name}.pid"

remtroll_start()
{
    echo "Starting RemTroll"
    /usr/local/bin/remtroll {config}
}

load_rc_config $name
run_rc_command "$1"
