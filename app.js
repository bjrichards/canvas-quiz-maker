/** A class containing information required to contain a question and its answers. */
class Question {
    /**
     * Constructor class for question.
     * @param {int} id Unique identifier for this instance of question.
     * @param {int} orderPosition Position for this instance of question in relation to the other questions.
     * @param {string} text Intitial text of this instance of question.
     */
    constructor(id, orderPosition, text = "") {
        this.id = id;
        this.orderPosition = orderPosition;
        this.answers = [];
        this.text = text;
        this.questionType = questionTypes[0];
        this.correctAnswerId = null;
        this.buttonAddAnswer = null;
        this.inputFieldText = null;
        this.inputFieldDropdown = null;
        this.inputCheckboxAnswers = [];
    }

    /**
     * Returns the unique id of the question as a string.
     * @returns {string} Unique identifier of the question.
     */
    getId() {
        return this.id.toString();
    }

    /**
     * Returns the position of the question in relation to all the questions.
     * @returns {int} Position of the question in relation to all the questions.
     */
    getOrderPosition() {
        return this.orderPosition;
    }

    /**
     * Returns the question text.
     * @returns {string} Question text.
     */
    getText() {
        return this.text;
    }

    /**
     * Returns the type of question this question is.
     * @returns {string} Question type.
     */
    getQuestionType() {
        return this.questionType;
    }

    /**
     * Returns the number of answers.
     * @returns {int} Number of answers
     */
    getAnswersLength() {
        return this.answers.length;
    }

    getAnswerIsCorrect(answerId) {
        return this.answers[answerId].getIsCorrectAnswer();
    }

    /**
     * Sets the question text input field.
     * @param {html.input} input Input tag of type text.
     */
    setTextInput(input) {
        this.inputFieldText = input;
    }

    /**
     * Set what input tag is used for the dropdown question type. 
     * @param {html.select} input HTML Select input tag.
     */
    setDropdownInput(input) {
        this.inputFieldDropdown = input;
    }

    /**
     * Set what button is used for the dropdown question type. 
     * @param {html.button} input HTML button tag.
     */
    setAddAnswerButton(button) {
        this.buttonAddAnswer = button;
    }

    addAnswerCheckbox(checkbox) {
        this.inputCheckboxAnswers.push(checkbox);
    }

    /**
     * Adds new answer to this question object.
     * @param {int} answerId Unique identifier for the answer.
     * @param {string} text Initial text of the answer.
     */
    addNewAnswer(answerId, text = "") {
        if (!Number.isInteger(answerId))
            answerId = this.getAnswersLength();
        this.answers.push(new Answer(answerId, answerId, text));
        updateDisplayQuestions(true);
    }

    /**
     * Attaches event listener to the text field input for the question.
     * @param {html.input} input Input tag of type text.
     */
    addTextInputEventListener(input) {
        this.setTextInput(input);
        this.inputFieldText.addEventListener("input", this.updateTextValue.bind(this), false);
    }

    /**
     * Attaches event listener to the select input field input for the question.
     * @param {html.select} input HTML Select input tag.
     */
    addDropdownInputEventListener(input) {
        this.inputFieldDropdown = input;
        this.inputFieldDropdown.addEventListener("change", this.updateQuestionType.bind(this), false);
    }

    /**
     * Attaches event listener to the button field input for the question.
     * @param {html.button} input HTML button tag.
     */
    addAddAnswerButtonEventListener(button) {
        this.setAddAnswerButton(button);
        this.buttonAddAnswer.addEventListener("click", this.addNewAnswer.bind(this), false);
    }

    addAnswerTextInputEventListener(answerIndex, input) {
        this.answers[answerIndex].addTextInputEventListener(input);
    }

    addCheckboxEventListener(answerIndex, checkbox) {
        this.addAnswerCheckbox(checkbox);
        this.inputCheckboxAnswers[answerIndex].addEventListener("change", this.updateCheckboxes.bind(this), false);
    }

    clearCheckboxes() {
        while (this.inputCheckboxAnswers.length > 0)
            this.inputCheckboxAnswers.pop();
    }

    clearAnswers() {
        while (this.getAnswersLength() > 0) {
            this.answers.pop();
        }
    }

    updateCheckboxes() {
        var answerCheckboxId = event.target.id.split('-').pop();
        if (event.target.checked) {
            this.answers[answerCheckboxId].setAsCorrectAnswer(true);
            if (this.questionType != enumQuestions.MultipleAnswers) {
                for (var i = 0; i < this.getAnswersLength(); i++) {
                    if (i != answerCheckboxId) {
                        this.inputCheckboxAnswers[i].checked = false;
                        this.answers[i].setAsCorrectAnswer(false);
                    }
                }
            }
        }
        else {
            this.answers[answerCheckboxId].setAsCorrectAnswer(false);
        }
    }

    /**
     * Updates the text variable (string) to the value of the inputFieldText.
     */
    updateTextValue() {
        this.text = this.inputFieldText.value;
    }

    /**
     * Updates the text variable (string) to the value of the inputFieldDropdown.
     */
    updateQuestionType() {
        var temp = this.questionType;
        this.questionType = this.inputFieldDropdown.value;

        if (temp != enumQuestions.TrueFalse && this.questionType == enumQuestions.TrueFalse) {
            this.clearAnswers();
            this.clearCheckboxes();
            this.addNewAnswer(0, "True");
            this.addNewAnswer(1, "False");
        }
        else if (temp == enumQuestions.TrueFalse && this.questionType != enumQuestions.TrueFalse) {
            while (this.getAnswersLength() > 0) {
                this.answers.pop();
            }
        }
        else if (temp != enumQuestions.Essay && this.questionType == enumQuestions.Essay) {
            this.clearAnswers();
            this.clearCheckboxes();
        }
        updateDisplayQuestions(true);
    }
}

class Answer {
    /**
     * 
     * @param {int} id Unique identifier for this instance of answer.
     * @param {int} orderPosition Position for this instance of answer in relation to the other answers.
     * @param {string} text Intitial text of this instance of answer.
     */
    constructor(id, orderPosition, text = "") {
        this.id = id;
        this.orderPosition = orderPosition;
        this.text = text;
        this.inputFieldText = null;
        this.correctAnswer = false;
    }

    /**
     * Returns the unique id of the answer as a string.
     * @returns {string} Unique identifier of the answer.
     */
    getId() {
        return this.id.toString();
    }

    /**
     * Returns the answer text.
     * @returns {string} answer text.
     */
    getText() {
        return this.text;
    }

    getIsCorrectAnswer() {
        return this.correctAnswer;
    }

    /**
     * Returns the position of the answer in relation to all the answers.
     * @returns {int} Position of the answer in relation to all the answers.
     */
    getOrderPosition() {
        return this.orderPosition;
    }

    setTextInput(input) {
        this.inputFieldText = input;
    }

    setAsCorrectAnswer(flag) {
        this.correctAnswer = flag;
    }

    /**
     * 
     * @param {*} input 
     */
    addTextInputEventListener(input) {
        this.setTextInput(input);
        this.inputFieldText.addEventListener("input", this.updateTextValue.bind(this), false);
    }

    /**
     * Updates the text variable (string) to the value of the inputFieldText.
     */
    updateTextValue() {
        this.text = this.inputFieldText.value;
    }
}

///////////////////////////////////////////////////////

const enumQuestions = {
    MultipleChoice: "Multiple Choice",
    TrueFalse: "True/False",
    MultipleAnswers: "Multiple Answers",
    Essay: "Essay"
}

const questionTypes = [enumQuestions.MultipleChoice, enumQuestions.TrueFalse, enumQuestions.MultipleAnswers, enumQuestions.Essay];
const quizBody = document.getElementById("quiz-body");
const newQuestionButton = document.getElementById("new-question-button");
const downloadButton = document.getElementById("download-button");

let questions = {};
let questionNum = 0;

newQuestionButton.addEventListener("click", addNewQuestion);
downloadButton.addEventListener("click", downloadTextFile);

/**
 * Adds new Question to the page.
 */
function addNewQuestion() {
    var newQuestion = new Question(questionNum, questionNum);
    questionNum++;

    questions[newQuestion.getId()] = newQuestion;
    updateDisplayQuestions(true);
}

/**
 * Adds new Answer to a question on the page.
 */
function addNewAnswer(questionId) {
    var question = questions[questionId];
    var newAnswer = new Answer(question.getAnswersLength(), question.getAnswersLength(), "");

    question.addNewAnswer(newAnswer);
    updateDisplayQuestions(true);
}

/**
 * Updates the displayed list of questions on the page.
 * @param {boolean} fullUpdate Whether or not the entire list should be re-rendered onto the page or just the newest question.
 */
function updateDisplayQuestions(fullUpdate = false) {
    if (fullUpdate) {
        while (quizBody.firstChild) {
            quizBody.removeChild(quizBody.firstChild);
        }
        var questionKeys = Object.keys(questions);
        for (var i = 0; i < questionKeys.length; i++) {
            questions[questionKeys[i]].clearCheckboxes();
            createQuestionContainer(quizBody, questions[questionKeys[i]])
        }
    }
}

/**
 * Creates all the html tags/objects needed for the passed in question.
 * @param {html.div} parent Parent div to append question to.
 * @param {Question} question Question object to pull data of question from.
 */
function createQuestionContainer(parent, question) {
    // Question-Answer container
    var divQuestionAnswer = document.createElement("div");
    divQuestionAnswer.id = "div-QA-" + question.getId();
    divQuestionAnswer.classList.add("question-answer-container");
    parent.appendChild(divQuestionAnswer);

    // Question container
    var divQuestion = document.createElement("div");
    divQuestion.id = "div-question-" + question.getId();
    divQuestion.classList.add("question-container");
    divQuestionAnswer.appendChild(divQuestion);
    // Question Label
    var labelQuestion = document.createElement("label");
    labelQuestion.setAttribute("for", "input-question-" + question.getId());
    labelQuestion.id = "label-question-" + question.getId();
    labelQuestion.innerText = (question.getOrderPosition() + 1).toString() + ": ";
    divQuestion.appendChild(labelQuestion);
    // Question input
    var inputQuestion = document.createElement("input");
    inputQuestion.setAttribute("type", "text");
    inputQuestion.id = "input-question-" + question.getId();
    if (question.getText != "") {
        inputQuestion.value = question.getText();
    }
    else {
        inputQuestion.setAttribute("placeholder", "");
    }
    divQuestion.appendChild(inputQuestion);
    divQuestion.appendChild(document.createElement("br"));
    // Dropdown selector for question type
    var selectQuestionType = document.createElement("select");
    selectQuestionType.id = "select-type-question-" + question.getId();
    for (var i = 0; i < questionTypes.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", questionTypes[i]);
        option.innerText = questionTypes[i];
        option.id = "option-question-" + question.getId();
        if (question.getQuestionType() === questionTypes[i]) {
            option.setAttribute("selected", "selected");
        }
        selectQuestionType.appendChild(option);
    }
    divQuestion.appendChild(selectQuestionType);
    // Add new answer button if applicable
    if (question.getQuestionType() != enumQuestions.TrueFalse && question.getQuestionType() != enumQuestions.Essay) {
        var addAnswerButton = document.createElement("button");
        addAnswerButton.classList.add("button_plus");
        divQuestion.appendChild(addAnswerButton);

        var plusImage = document.createElement("i");
        plusImage.setAttribute("class", "fa fa-plus");
        addAnswerButton.appendChild(plusImage);

        question.addAddAnswerButtonEventListener(addAnswerButton);
    }
    // Add more options button
    var addMoreOptionsButton = document.createElement("button");
    addMoreOptionsButton.classList.add("button_plus");
    divQuestion.appendChild(addMoreOptionsButton);

    var ellipsisImage = document.createElement("i");
    ellipsisImage.setAttribute("class", "fa fa-ellipsis-v");
    addMoreOptionsButton.appendChild(ellipsisImage);

    // question.addAddAnswerButtonEventListener(addAnswerButton);



    // Answer container
    var divAnswerContainer = document.createElement("div");
    divQuestionAnswer.append(divAnswerContainer);

    // Add answers
    for (var i = 0; i < question.getAnswersLength(); i++) {
        var inputCheckbox = document.createElement("input");
        inputCheckbox.id = "question-" + question.getId() + "-" + "answer-checkbox-" + question.answers[i].getId();
        inputCheckbox.setAttribute("type", "checkbox");
        inputCheckbox.checked = question.getAnswerIsCorrect(i);
        divAnswerContainer.append(inputCheckbox);
        question.addCheckboxEventListener(question.answers[i].getId(), inputCheckbox);

        var labelAnswer = document.createElement("label");
        labelAnswer.setAttribute("for", "question-" + question.getId() + "-" + "answer-input-" + question.answers[i].getId());
        labelAnswer.id = "question-" + question.getId() + "-" + "answer-label-" + question.answers[i].getId();
        labelAnswer.innerText = intToAlphabet(question.answers[i].getOrderPosition()) + ") ";
        divAnswerContainer.append(labelAnswer);

        var inputAnswer = document.createElement("input");
        inputAnswer.id = "question-" + question.getId() + "-" + "answer-input-" + question.answers[i].getId();
        inputAnswer.setAttribute("type", "text");
        inputAnswer.value = question.answers[i].getText();
        if (question.getQuestionType() === enumQuestions.TrueFalse) {
            inputAnswer.setAttribute("disabled", "");
        }
        if (question.getQuestionType() !== enumQuestions.TrueFalse && question.getQuestionType() !== enumQuestions.Essay)
            question.addAnswerTextInputEventListener(i, inputAnswer);
        divAnswerContainer.append(inputAnswer);

        divAnswerContainer.appendChild(document.createElement("br"));

    }


    // Add event listener to question class
    question.addTextInputEventListener(inputQuestion);
    question.addDropdownInputEventListener(selectQuestionType);
}

/**
 * 
 * @param {int} i Number to map to alphabet (starts at 0) 
 * @returns {char} Letter of alphabet.
 */
function intToAlphabet(i) {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    return alphabet[i];
}

///////////////////////////////////////////

/**
 * Creates and downloads the quiz data to a txt file.
 */
function downloadTextFile() {
    const link = document.createElement("a");
    const content = createTextStringFromQuestions();
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "quiz.txt";
    link.click();
    URL.revokeObjectURL(link.href);
}

/**
 * Creates string object in format required for San Diego Canvas Quiz Converter applciation.
 * @returns {string} String object of all questions/answers.
 */
function createTextStringFromQuestions() {
    var text = "";
    var questionKeys = Object.keys(questions);
    for (var i = 0; i < questionKeys.length; i++) {
        // Set question
        text = text + (i + 1).toString() + ". " + questions[questionKeys[i]].getText();

        // Set essay if question is of type Essay
        if (questions[questionKeys[i]].getQuestionType() === enumQuestions.Essay) {
            text = text + "\n";
            text = text + "___";
        }
        else {
            for (var j = 0; j < questions[questionKeys[i]].getAnswersLength(); j++) {
                text = text + "\n";
                if (questions[questionKeys[i]].getQuestionType() == enumQuestions.MultipleAnswers) {
                    text = text + "[";
                    if (questions[questionKeys[i]].getAnswerIsCorrect(j))
                        text = text + "*";
                    text = text + "] ";
                }
                else {
                    if (questions[questionKeys[i]].getAnswerIsCorrect(j))
                        text = text + "*";
                    text = text + intToAlphabet(questions[questionKeys[i]].answers[j].getOrderPosition()) + ") ";
                }
                text = text + questions[questionKeys[i]].answers[j].getText();
            }
        }

        text = text + "\n\n";
    }
    return text;
}