# Freifunk MD Lost Node Notifier

## Description

This is a service, which crawls the information from the public nodes.json and notifies persons, which are subscribed,
if their node is offline.

## TODO

+ General
    + Try to use _.get, due to inconsistent node information.
+ Mail
    + Adding mail client
+ Configuration
    + Add configuration options as env variables
        + nodes.json endpoint
        + Mail client configuration