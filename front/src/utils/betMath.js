

import BigNumber from 'bignumber.js';

import {betState} from 'utils/betStates';

/** Generic computation of the user gains, checks whether the team they've
    bet on won
*/
export function computeFinalGain(hasBetOnTeam, team0BetSum, team1BetSum, currentBetState, tax) {
  var winnerPool;
  var loserPool;
  var amount = hasBetOnTeam.amount;

  if (hasBetOnTeam.team === null)
    return new BigNumber(0);

  if ( amount.isZero() ||
       (currentBetState < betState.team0Won || currentBetState > betState.draw) ||
       (currentBetState === betState.draw)
     )
    return amount;

  var hasBetTeam0 = !hasBetOnTeam.team;
  var hasBetTeam1 = hasBetOnTeam.team;

  if (currentBetState === betState.team0Won && hasBetTeam1)
    return team0BetSum.isZero() ? amount : (new BigNumber(0));
  if (currentBetState === betState.team1Won && hasBetTeam0)
    return team1BetSum.isZero() ? amount : (new BigNumber(0));

  if (currentBetState === betState.team0Won) {
    winnerPool = team0BetSum;
    loserPool = team1BetSum;
  }
  else if (currentBetState === betState.team1Won) {
    winnerPool = team1BetSum;
    loserPool = team0BetSum;
  }

  return computeGain(amount, winnerPool, loserPool, tax);
}

/** Does the actual computation
  */
export function computeGain(amount, winnerPool, loserPool, tax) {
  if (loserPool.isZero())
    return amount;
  var profit = amount.dividedBy(winnerPool).times(loserPool);
  if (profit.gt(0))
    profit = profit.minus(profit.times(new BigNumber(tax)))
  return amount.plus(profit);
}

