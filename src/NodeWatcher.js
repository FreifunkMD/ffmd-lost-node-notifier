const Logger = require('logplease');
const logger = Logger.create('NodeWatcher.js');
const axios = require('axios');
const moment = require('moment');
const validator = require('validator');

class NodeWatcher {
    constructor() {
        this.nodeList = {};

    }

    notifyOwner(node, nodeListEntry) {

        const hasMail = node.nodeinfo.owner && node.nodeinfo.owner.contact;

        if(!hasMail) {
            logger.info(`Node does not have owner details, so the owner does not get any notification about this.`)
            return;
        }

        const eMail = node.nodeinfo.owner.contact;
        const isValidMail = validator.isEmail(eMail);

        if(isValidMail) {
            logger.info(`Mail would be sent to ${eMail}.`);
        } else {
            logger.info(`Mail ${eMail} was not valid, so the owner does not get any notification about this.`);
        }
    }

    checkNode(node, lastSeen, isOnline) {
        const nodeId = node.nodeinfo.node_id;

        // If there is an lastSeen, the node was offline the last time we scanned it.
        // So, if there is no lastSeen, the node is online.
        const notedOffline = !!this.nodeList[nodeId];
        const nodeListEntry = this.nodeList[nodeId];

        if (isOnline && notedOffline) {
            logger.info(`Node ${nodeId} is back online.`);
            this.nodeList[nodeId] = null;
        } else if (!isOnline && !notedOffline) {
            logger.info(`Node ${nodeId} is now offline. Last Seen was ${lastSeen.toDate()}`)
            this.nodeList[nodeId] = {
                lastSeen: lastSeen.toDate(),
                wasNotified: false,
            }
        } else if (notedOffline) {

            const isOfflineAndShouldBeNotified = moment.duration(moment().diff(lastSeen)).asDays() > 7;
            if(isOfflineAndShouldBeNotified && !nodeListEntry.wasNotified) {
                this.notifyOwner(node, nodeListEntry);
                nodeListEntry.wasNotified = true;
                logger.warn(`Node ${nodeId} is offline and should be notified.`);
            }

        }
    }

    checkNodes() {

        axios.get('http://map.md.freifunk.net/data/nodes.json').then((reply) => {

            const nodeList = reply.data.nodes;
            const nodeIds = nodeList.forEach((node) => {

                const nodeIsOnline = !!node.flags.online;
                const lastSeen = moment(node.lastseen);

                this.checkNode(
                    node,
                    lastSeen,
                    nodeIsOnline
                );
            })

        })


    }


}

module.exports = NodeWatcher;