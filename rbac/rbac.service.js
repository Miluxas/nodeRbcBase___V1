const {Run}=require('../_helpers/db')

module.exports = {
    addItem,
    assignRoleToUser,
    addChildToItem,
    getUserRoles,
    removeUserRole,
    getListOfItems,
    removeItemChild,
    getListOfItemChilds
};

/**
 * Add an item
 * @param {string} name             Item name
 * @param {int} type                Type of Item. 1 role, 2 actions    
 * @param {string} description      Description of item 
 * @param {string} rule_name        Rule name
 * @param {string} data             Data
 */
async function addItem(name,type,description,rule_name,data) {
    var nowDT=Math.floor(Date.now() / 1000);
    return await Run(`INSERT INTO auth_item
    (name,
    type,
    description,
    rule_name,
    data,
    created_at,
    updated_at)
    VALUES
    ('${name}',
    '${type}',
    '${description}',
    '${rule_name}',
    '${data}',
    ${nowDT},
    ${nowDT})`)
}

/**
 * Assign a role to a user
 * @param {string} item_name Name of role
 * @param {int} user_id User Id
 */
async function assignRoleToUser(item_name,user_id) {
    var nowDT=Math.floor(Date.now() / 1000);
    return await Run(`INSERT INTO auth_assignment
    (item_name,
    user_id,
    created_at)
    VALUES
    ('${item_name}',
    ${user_id},
    ${nowDT})`)
}

/**
 * Add an item as a child of other item
 * @param {string} parent       Parent Item
 * @param {string} child        Child Item
 */
async function addChildToItem(parent,child) {
    return await Run(`INSERT INTO auth_item_child
    (parent,
    child)
    VALUES
    ('${parent}',
    '${child}')`)
}

/**
 * Get a list of user's roles
 * @param {int} user_id User Id
 */
async function getUserRoles(user_id) {
    return await Run(`Select * from auth_assignment where user_id=${user_id}`)
}

/**
 * Remove a role of user
 * @param {string} item_name Role name
 * @param {int} user_id User Id
 */
async function removeUserRole(item_name,user_id) {
    return await Run(`Delete from auth_assignment where item_name='${item_name}' and user_id=${user_id}`)
}

/**
 * Get a list of item that the name of item content strSearch
 * @param {string} strSearch Part of item name
 * @param {int} type type of item
 */
async function getListOfItems(strSearch,type) {
    return await Run(`SELECT * FROM auth_item where name like '%${strSearch}%' and type=${type}`)
}

/**
 * Remove a child of Item
 * @param {string} parent Parent Item
 * @param {string} child Child item
 */
async function removeItemChild(parent,child) {
    return await Run(`Delete from auth_item_child where parent='${parent}' and child='${child}'`)
}

/**
 * Get the child items of a parent item
 * @param {string} item_name Parent item name
 */
async function getListOfItemChilds(item_name) {
    return await Run(`select * from auth_item_child where parent='${item_name}'`)
}

