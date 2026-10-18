@echo off
title SkillPath AI Live Tunnel
:loop
echo [%date% %time%] Launching live tunnel for SkillPath AI (port 3000)...
call npx -y localtunnel --port 3000 --subdomain skillpathai
echo [%date% %time%] Tunnel disconnected, reconnecting in 2 seconds...
timeout /t 2 /nobreak >nul
goto loop
