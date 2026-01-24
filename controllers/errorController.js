/* **********************
* Trigger Intentional Error
* ********************** */
errorCont.triggerError = async function (req, res, next) {
    const error = new Error('Oh no! There was a crash. Maybe try a different route?')
    error.status = 500
    throw error
}

module.exports = errorCont

