#!/bin/bash
while true
do
    php /var/www/html/artisan schedule:run --verbose
    sleep 60
done
