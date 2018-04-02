const [r, l] = ['right', 'left']
const tape_pos_increment = {right: +1, left: -1}
const h = 'halt'
const [A, B, C] = [0, 1, 2]

const _3_states_6_ones = [
[[1, r, B], [1, l, C]],
[[1, l, A], [1, r, B]],
[[1, l, B], [1, r, h]],
]
const infinitely_looping_program = [
[[1, r, B], [0, r, B]],
[[1, l, A], [1, l, A]],
]

function run(states){
    var tape = [], tape_pos = 0, current_state = 0, snapshots = [], step = 0
    do {
        var symbol_under_tape = tape[tape_pos]==1?1:0
        var current_tuple = states[current_state][symbol_under_tape]

        if(false){
            var state_snapshot = JSON.stringify(
                [current_tuple, tape, tape_pos, current_state]
            )
            if(snapshots.indexOf(state_snapshot) != -1)
                return [count_ones(tape), 'repeating']
            else snapshots.push(state_snapshot)
        }

        tape[tape_pos] = current_tuple[0]
        tape_pos += tape_pos_increment[ current_tuple[1] ]
        current_state = current_tuple[2]

        step++
        if(step == 50) return [count_ones(tape), 'max steps']

        //console.log(tape)

    } while ( current_tuple[2] != h )
    return [count_ones(tape), 'terminated']
}

console.log( 'busy beavers solution for 2 states:', busy_beavers_problem(2) ) // was 3, but took too much so the demo is now for 2 states
console.log( 'result of running:', run(_3_states_6_ones) )
console.log( 'result of running:', run(infinitely_looping_program) )

function ideal_program_count_given_states_count(number_of_states){
    return ((4*( number_of_states +1))**2)** number_of_states
}

function* generate_tuples(states_count){
    for(var value_to_write of [0, 1]){
        for(var tape_move_direction of [r, l]){
            for(var next_state = 0; next_state < states_count; next_state++){
                yield [value_to_write, tape_move_direction, next_state]
            }
            yield [value_to_write, tape_move_direction, h]
        }
    }
}

function* generate_states(states_count){
    for(var first_tuple of generate_tuples(states_count)){
        first_tuple = first_tuple.slice()
        for(var second_tuple of generate_tuples(states_count)){
            second_tuple = second_tuple.slice()
            yield [first_tuple, second_tuple]
        }
    }
}

function* nested_generate_states(states_count, depth, array = []){
    if(depth >= 1){
        for(var value of generate_states(states_count)){
            var new_array = array.slice()
            new_array.push(value.slice())
            yield* nested_generate_states(states_count, depth-1, new_array )
        }
    } else if(depth == 0)
        yield array.slice()
}

function* generate_programs(states_count){
    yield* nested_generate_states(states_count, states_count)
}

function tests(){
    var tuple_to_find = JSON.stringify(_3_states_6_ones[0][0])
    for(var tuple of generate_tuples(3)){
        tuple = JSON.stringify(tuple)
        //console.log(tuple, JSON.stringify(_3_states_6_ones[0][0])
        if( tuple == tuple_to_find ) console.log('FOUND TUPLE', tuple)
    }

    var state_to_find = JSON.stringify(_3_states_6_ones[0])
    for(var state of generate_states(3)){
        state = JSON.stringify(state)
        //console.log(state, _3_states_6_ones[0])
        if( state ==  state_to_find) console.log('FOUND STATE', state)
    }

    var program_to_find = JSON.stringify(_3_states_6_ones)
    console.log('PROGRAM to find (3 states): ', program_to_find)
    var count = 0
    var number_of_states = 3 // should be 3 for example program with 3 states to find
    // generate_programs(3) -> ((4*( 3 +1))**2)** 3 -> 16777216 programs
    for(var program of generate_programs(number_of_states)){
        program = JSON.stringify(program)
        //console.log( program )
        count ++
        if( program == program_to_find ) console.log('FOUND PROGRAM', program)
    }
    var ideal_program_count = ideal_program_count_given_states_count(number_of_states)
    console.log( 'program count:', count, count == ideal_program_count ? 'CORRECT' : 'WRONG', 'count', 'ideal count:', ideal_program_count)
}

function busy_beavers_problem(number_of_states){
    console.log('started busy beaver with number of states:', number_of_states)
    var max = -1
    var counter = 0
    var ideal_program_count = ideal_program_count_given_states_count(number_of_states)
    for(var program of generate_programs(number_of_states)){
        var result = run(program)
        if(result[1] == 'terminated' && result[0] > max) max = result[0]
        counter++
        console.log('Programs counter:', counter, '/', ideal_program_count)
    }
    return max
}

function count_ones(array){
    count_of_ones = 0; for(var index in array) count_of_ones += array[index]
    return count_of_ones
}
