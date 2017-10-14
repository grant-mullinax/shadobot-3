module.exports  = class Command{
    constructor(execute, description){
        this.execute = execute;
        this.description = description;
    }
};