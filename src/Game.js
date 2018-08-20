import React, { Component } from 'react';
import Dice from './Dice';
import Scoring from './Scoring';
import './Game.css';

const NUM_DICE = 5;
const NUM_ROLLS = 3;

class Game extends Component {
  state = {
    dice: Array.from({ length: NUM_DICE }),
    locked: Array(NUM_DICE).fill(false),
    rollsLeft: NUM_ROLLS,
    scores: {
      ones: undefined,
      twos: undefined,
      threes: undefined,
      fours: undefined,
      fives: undefined,
      sixes: undefined,
      threeOfKind: undefined,
      fourOfKind: undefined,
      fullHouse: undefined,
      smallStraight: undefined,
      largeStraight: undefined,
      yahtzee: undefined,
      chance: undefined
    },
    totalScore: 0,
    // keep track if game is over
    numOfTurns: 0
  };

  // added feature of having dice roll when all component is mounted
  componentDidMount() {
    this.roll();
  }

  roll = evt => {
    // roll dice whose indexes are in reroll
    // also implemented check on rolls left
    if (this.state.rollsLeft > 0) {
      this.setState(st => ({
        dice: st.dice.map(
          (d, i) => (st.locked[i] ? d : Math.ceil(Math.random() * 6))
        ),
        locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
        rollsLeft: st.rollsLeft - 1
      }));
    }
  };

  toggleLocked = idx => {
    // toggle whether idx(refers to dice in array) is in locked or not
    // only allow you to toggle when rolls left is greater than 1
    if (this.state.rollsLeft > 0) {
      this.setState(st => ({
        locked: [
          ...st.locked.slice(0, idx),
          !st.locked[idx],
          ...st.locked.slice(idx + 1)
        ]
      }));
    }
  };

  // add feature to check whether game is over in do score since once all the rules have been checked then you would end the game
  doScore = (rulename, ruleFn) => {
    // evaluate this ruleFn with the dice and score this rulename
    // fixed that you so that a line can only be scored once
    if (this.state.scores[rulename] === undefined) {
      // bug is when i have to reroll
      this.setState(st => ({
        scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
        rollsLeft: NUM_ROLLS,
        locked: Array(NUM_DICE).fill(false),
        numOfTurns: st.numOfTurns + 1
      }));
      // set state will run async??? issue is when I want to reroll locked dice
      this.roll();
    }
    // check if game is over??
    // for (let rule in this.state.scores) {
    //   if (this.state.scores[rule] !== undefined) {
    //     // this.setState(st => /* how to update total score??? */)
    //     // this.setState(st => ({numOfTurns: st.numOfTurns + 1}))
    //   }
    // }
  };

  render() {
    return (
      // terenary to check if game is over?
      // this.state.numOfTurns === 13 ? <div>Do you want to play again?</div> ? 
      <section>
        <Dice
          dice={this.state.dice}
          locked={this.state.locked}
          handleClick={this.toggleLocked}
        />
        <button
          className="Game-reroll"
          disabled={this.state.locked.every(x => x)}
          onClick={this.roll}
        >
          {this.state.rollsLeft} Rerolls Left
        </button>
        <Scoring doScore={this.doScore} scores={this.state.scores} />
      </section>
    )
  }
}

export default Game;
