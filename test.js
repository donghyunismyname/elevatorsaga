{
    init: function(elevators, floors) {
        console.log('========init===============')
        for (f of floors) console.log(f.buttonStates)

        elevator = elevators[0]
        elevator.goToFloor(floors.length-1);

        elevator.on("stopped_at_floor", function(floorNum) {
            console.log('stopped_at_floor', floorNum);
            alert('stopped_at_floor', floorNum);
        });
        elevator.on("passing_floor", function(floorNum, direction) {
            console.log('passing_floor', floorNum, direction);
            alert('passing_floor', floorNum, direction);
            this.goToFloor(floorNum, true);
        });

    },

    update: function(dt, elevators, floors) {

    },
}
