// Instruction parsing
class Instruction {
  constructor(type, argument = '') {
    this.type = type.trim();
    this.argument = this.parseArg(argument.trim());
  }

  parseArg(argument) {
    const pInt = (a) => parseInt(a)
    const pStr = (a) => a
    const pNull = (a) => null
    const typeDict = {
      'Move': pInt,
      'Rotate': pInt,
      'Down': pNull,
      'Up': pNull,
      'Color': pStr,
      'Width': pInt
    };

    if (!(this.type in typeDict)) {
      throw 'invalid argument:' + argument;
    }

    return typeDict[this.type](argument);

  }
}

const parseInstructions = (instructions) => {
  return instructions
    .trim()
    .split('\n')
    .map(s => s.trim())
    .map(parseInstruction);
}
const parseInstruction = (instruction) => {
  const instructions = [
    'Move',
    'Rotate',
    'Down',
    'Up',
    'Color',
    'Width'
  ];
  return new Instruction(...instruction.split(' '));
};

// Turtle

class Turtle {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = {x: canvas.width / 2, y: canvas.height / 2};
    this.penDown = false;
    this.color = 'black';
    this.width = 5;
    this.rotation = 0;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineWidth = '2'
    this.ctx.lineCap = 'round'
    this.ctx.fillStyle = 'white';
  }

  drawTurtle() {
    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = 'white';
  }

  perform(instructions) {
    instructions.forEach(instr => {
      const doInstr = {
        Move: () => {
          if (this.penDown) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.position.x, this.position.y);
            this.position.x += instr.argument * Math.cos(this.rotation * Math.PI / 180);
            this.position.y += instr.argument * Math.sin(this.rotation * Math.PI / 180);
            this.ctx.lineTo(this.position.x, this.position.y);
            this.ctx.stroke()
          } else {
            this.position.x += instr.argument * Math.cos(this.rotation * Math.PI / 180);
            this.position.y += instr.argument * Math.sin(this.rotation * Math.PI / 180);
            this.ctx.moveTo(this.position.x, this.position.y);
          }
        },
        Rotate: () => { this.rotation += instr.argument },
        Down: () => {
          this.penDown = true;
          this.ctx.moveTo(this.position.x, this.position.y);
        },
        Up: () => {
          this.penDown = false;
        },
        Color: () => { this.ctx.strokeStyle = instr.argument; },
        Width: () => { this.ctx.lineWidth = instr.argument; }
      };
      doInstr[instr.type]()
    });
  }
}



let turtle = new Turtle(document.querySelector('canvas'));

let instructions = 'Down; Move 40; Rotate 90; Move 70; Up'


$('#submit').on('click', () => {
  turtle = new Turtle(document.querySelector('canvas'));
  turtle.perform(parseInstructions($('#instructions').val()));
  // turtle.drawTurtle();

});

$('#reset').on('click', () => {
  turtle = new Turtle(document.querySelector('canvas'));
});
