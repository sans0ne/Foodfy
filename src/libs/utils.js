module.exports = {
    date(timestamp){
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth()+1}`.slice(-2)
        const day = `0${date.getUTCDate()-1}`.slice(-2)
        const hour = date.getHours()
        const min = date.getUTCMinutes()
        const seg = date.getUTCSeconds()

        return{
            iso:`${year}-${month}-${day} ${hour}:${min}:${seg}`
        }
    }
}