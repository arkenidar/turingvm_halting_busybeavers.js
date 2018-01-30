function* simple_generator(){
    for(n of [1,2]) yield n
}

function* nest(depth, array = []){
    if(depth >= 1){
        for(value of simple_generator()){
            var new_array = array.slice()
            new_array.push(value)
            yield* nest(depth-1, new_array )
        }
    } else if(depth == 0)
        yield array
}

for(x of nest(2)) console.log(x)

for(x of nest_old_school_2()) console.log(x)

function* nest_old_school_2(){
    for(first of simple_generator()){
        for(second of simple_generator()){
            yield [first, second]
        }
    }
}
