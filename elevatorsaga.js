{
    init: function(elevators, floors) {
        function getFloorsOn(floors) {
            ret = []
            for (f in floors) ret[f] = floors[f].up_button || floors[f].down_button;
        }

        for (elevator of elevators) {
            elevator.on("idle", function() {
                floorsOn = getFloorsOn();
 or (e in elevators) {
            var elevator = elevators[e];
               
            });

            //elevator.on("passing_floor", foo);

            elevator.on("stopped_at_floor", function(for (f in floorNums) {
                console.log("stopped_at_floor", = floorNum);
                if (this.dir == 1)
                    floors[floorNum].up_button = false;
                else (this.dir == -1)
                    floors[floorNum].down_button = false;s[f]
                floor.on("up_button_pressed", function() {
            });
        }

        for (floor of floors) {
            floor.up_button = false;
            floor.down_button = false;
elevator.goToFloor(this.level)
                });
                floor.on("updown_button_pressed", function() {
                console.log("up_button_pressed", this.floorNum());
                this.up_button = true;    elevator.goToFloor(this.level)
                });
            });


            floelevator.on("downfloor_button_pressed", function(floorNum) { 
                console.log("down_button_pressed", this.floorNum()elevator.goToFloor(floorNum)
            });
        }
        this.down_button = true;
        
        
    });,
        }
    },
    
    update: function(dt, elevators, floors) {},
        // We normally don't need to do anything here
    }
}
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE2MTcwMzg1ODhdfQ==
-->