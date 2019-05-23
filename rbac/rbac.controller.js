const router = require('express').Router();
const rbacService = require('./rbac.service');
const authorize = require('_helpers/authorize')

// routes
router.get('/addRole', authorize(), addRole);                               // add a role
router.get('/addAction', authorize(), addAction);                           // add as action
router.get('/assignRoleToUser', authorize(), assignRoleToUser);             // assign a role to a user
router.get('/addChildToItem', authorize(), addChildToItem);                 // add as action
router.get('/getUserRoles', authorize(), getUserRoles);                     // get a user's roles
router.get('/removeUserRole', authorize(), removeUserRole);                 // remove a role of user
router.get('/getListOfRoles', authorize(), getListOfRoles);                 // get list of roles
router.get('/getListOfActions', authorize(), getListOfActions);             // get list of actions
router.get('/removeItemChild', authorize(), removeItemChild);               // Remove a child of item
router.get('/getListOfItemChilds', authorize(), getListOfItemChilds);       // get list of an item childs
module.exports = router;


function addRole(req, res, next) {
    req.body.type=1
    rbacService.addItem(req.body)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function addAction(req, res, next) {
    req.body.type=2
    rbacService.addItem(req.body)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function assignRoleToUser(req, res, next) {
    rbacService.assignRoleToUser(req.body)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function addChildToItem(req, res, next) {
    rbacService.addChildToItem(req.body)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getUserRoles(req, res, next) {
    rbacService.getUserRoles(req.user.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function removeUserRole(req, res, next) {
    rbacService.removeUserRole(req.params.name,req.user.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getListOfRoles(req, res, next) {
    rbacService.getListOfItems(req.params.name,1)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getListOfActions(req, res, next) {
    rbacService.getListOfItems(req.params.name,2)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function removeItemChild(req, res, next) {
    rbacService.removeItemChild(req.params.parent,req.params.child)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}
function getListOfItemChilds(req, res, next) {
    rbacService.getListOfItemChilds(req.params.parent)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}
