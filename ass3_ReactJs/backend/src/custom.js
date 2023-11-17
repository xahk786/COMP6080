/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  const safeReturn = { ...question };
  delete safeReturn.correct;

  console.log('safe ret:', safeReturn)
  console.log('See question: ', question);
  return safeReturn;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {

  // const arr = Object.values(obj);
  // console.log(arr)

  if (question.type === 'sc'){
    return [question.correct]
  }
  else {
    return question.correct // For a single answer
  }
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  console.log(question)
  return [
    question.options
  ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return parseInt(question.duration);
};
