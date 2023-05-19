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

    /**
     * Returns if the referenced Answer object is true or false.
     * @param {int} answerId Unique identifier for the answer.
     * @returns {boolean} If the answer referenced is considered correct.
     */
    getAnswerIsCorrect(answerId) {
        return this.answers[answerId].getIsCorrectAnswer();
    }

    /**
     * 
     * @returns {int} Number of answers of this question that are correct.
     */
    getNumberOfCorrectAnswers() {
        var result = 0;
        for (var i = 0; i < this.getAnswersLength(); i++) {
            if (this.getAnswerIsCorrect(i))
                result++;
        }
        return result;
    }

    /**
     * Sets the question text input field.
     * @param {html.input} input HTML input element of type text.
     */
    setTextInput(input) {
        this.inputFieldText = input;
    }

    /**
     * Set what input tag is used for the dropdown question type. 
     * @param {html.select} input HTML input element of type select.
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

    /**
     * 
     * @param {int} answerId Unique identifier for the answer.
     * @param {boolean} flag If the answer referenced is considered correct.
     */
    setAnswerCorrectedness(answerId, flag) {
        this.answers[answerId].setAsCorrectAnswer(flag);
    }

    /**
     * 
     * @param {string} qType Question type from enumQuestions.
     */
    setQuestionType(qType) {
        this.questionType = qType;
    }

    /**
     * 
     * @param {html.input} checkbox Input element of type checkbox.
     */
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
     * @param {html.input} input HTML input element of type text.
     */
    addTextInputEventListener(input) {
        this.setTextInput(input);
        this.inputFieldText.addEventListener("input", this.updateTextValue.bind(this), false);
    }

    /**
     * Attaches event listener to the select input field input for the question.
     * @param {html.select} input HTML input element of type select.
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

    /**
     * Attaches event listener to the text input element within the referenced Answer object.
     * @param {int} answerIndex Index of answers array to give the input element to.
     * @param {html.input} input HTML input element of type text.
     */
    addAnswerTextInputEventListener(answerIndex, input) {
        this.answers[answerIndex].addTextInputEventListener(input);
    }

    /**
     * Attaches event listener to the checkbox input element within the referenced Answer object.
     * @param {int} answerIndex Index of answers array to give the input element to.
     * @param {html.input} input HTML input element of type checkbox.
     */
    addCheckboxEventListener(answerIndex, checkbox) {
        this.addAnswerCheckbox(checkbox);
        this.inputCheckboxAnswers[answerIndex].addEventListener("change", this.updateCheckboxes.bind(this), false);
    }

    /**
     * Deletes all HTML input checkboxes in this question object.
     */
    clearCheckboxes() {
        while (this.inputCheckboxAnswers.length > 0)
            this.inputCheckboxAnswers.pop();
    }

    /**
     * Deletes all the answers in this question object.
     */
    clearAnswers() {
        while (this.getAnswersLength() > 0) {
            this.answers.pop();
        }
    }

    /**
     * Updates Answer objects of this question object to be true or false depending on the checkbox associated to the Answer object.
     */
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
        this.updateTextAreaSize();
    }

    /**
     * Updates size of question textarea to show all lines.
     */
    updateTextAreaSize() {
        this.inputFieldText.style.height = "1.2em";
        this.inputFieldText.style.height = this.inputFieldText.scrollHeight + "px";
    }

    /**
     * Updates the text variable (string) to the value of the inputFieldDropdown.
     */
    updateQuestionType() {
        var temp = this.questionType;
        this.questionType = this.inputFieldDropdown.value;

        // If question type True/False now but wasn't prior
        if (temp != enumQuestions.TrueFalse && this.questionType == enumQuestions.TrueFalse) {
            this.clearAnswers();
            this.clearCheckboxes();
            this.addNewAnswer(0, "True");
            this.addNewAnswer(1, "False");
        }
        // If question type is not True/False but was prior
        else if (temp == enumQuestions.TrueFalse && this.questionType != enumQuestions.TrueFalse) {
            while (this.getAnswersLength() > 0) {
                this.answers.pop();
            }
        }
        // If question type is Essay but wasn't prior
        else if (temp != enumQuestions.Essay && this.questionType == enumQuestions.Essay) {
            this.clearAnswers();
            this.clearCheckboxes();
        }
        updateDisplayQuestions(true);
    }
}


/** A class containing information required to contain an answer. */
class Answer {
    /**
     * Constructor for the Answer object. Contains identifying variables, state, and inputs associated to this Answer.
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

    /**
     * Returns if the referenced Answer object is true or false.
     * @returns {boolean} If the answer is considered correct.
     */
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

    /**
     * Sets the answer text input field.
     * @param {html.input} input HTML input element of type text.
     */
    setTextInput(input) {
        this.inputFieldText = input;
    }

    /**
     * Sets whether this answer is considered correct or not.
     * @param {boolean} flag True if answer is considered correct, else false.
     */
    setAsCorrectAnswer(flag) {
        this.correctAnswer = flag;
    }

    /**
      * Attaches event listener to the text field input for the answer.
      * @param {html.input} input HTML input element of type text.
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
        this.updateTextAreaSize;
    }

    /**
     * Updates size of question textarea to show all lines.
     */
    updateTextAreaSize() {
        this.inputFieldText.style.height = "1.2em";
        this.inputFieldText.style.height = this.inputFieldText.scrollHeight + "px";
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
function addNewQuestion(text = "", updateDisplay = true) {
    if (text == "[object MouseEvent]") {
        text = "";
    }
    var newQuestion = new Question(questionNum, questionNum, text);
    questionNum++;

    questions[newQuestion.getId()] = newQuestion;
    if (updateDisplay) {
        updateDisplayQuestions(true);
        document.getElementById("div-QA-" + newQuestion.getId()).scrollIntoView({ behavior: "instant", block: "center" });
    }
}

/**
 * Adds new Answer to a Question object.
 * @param {int} questionId Id of Question object to add new answer to.
 */
function addNewAnswer(questionId, text = "", updateDisplay = true) {
    var question = questions[questionId];
    var newAnswer = new Answer(question.getAnswersLength(), question.getAnswersLength(), text);
    question.addNewAnswer(newAnswer, newAnswer.getText());
    if (updateDisplay)
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
    labelQuestion.classList.add("label-question");
    divQuestion.appendChild(labelQuestion);
    // Question input
    var inputQuestion = document.createElement("textarea");
    // inputQuestion.setAttribute("type", "textarea");
    inputQuestion.setAttribute("rows", "1");
    inputQuestion.id = "input-question-" + question.getId();
    inputQuestion.classList.add("input-question");
    if (question.getText != "") {
        inputQuestion.value = question.getText();
    }
    else {
        inputQuestion.setAttribute("placeholder", "");
    }
    divQuestion.appendChild(inputQuestion);
    // Add new answer button if applicable

    var addAnswerButton = document.createElement("button");
    addAnswerButton.classList.add("question-opt-button");
    divQuestion.appendChild(addAnswerButton);

    var plusImage = document.createElement("i");
    plusImage.setAttribute("class", "fa fa-plus");
    addAnswerButton.appendChild(plusImage);

    if (question.getQuestionType() == enumQuestions.TrueFalse || question.getQuestionType() == enumQuestions.Essay) {
        addAnswerButton.setAttribute("disabled", "");
    }

    question.addAddAnswerButtonEventListener(addAnswerButton);

    // Dropdown selector for question type
    var selectQuestionType = document.createElement("select");
    selectQuestionType.id = "select-type-question-" + question.getId();
    selectQuestionType.classList.add("question-opt-button");
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

    // Add more options button
    var addMoreOptionsButton = document.createElement("button");
    addMoreOptionsButton.classList.add("question-opt-button");
    divQuestion.appendChild(addMoreOptionsButton);

    var ellipsisImage = document.createElement("i");
    ellipsisImage.setAttribute("class", "fa fa-ellipsis-v");
    addMoreOptionsButton.appendChild(ellipsisImage);

    // Answer container
    var divAnswerContainer = document.createElement("div");
    divAnswerContainer.classList.add("answer-container");
    divQuestionAnswer.append(divAnswerContainer);

    // Add answers
    for (var i = 0; i < question.getAnswersLength(); i++) {
        var divSingleAnswerContainer = document.createElement("div");
        divSingleAnswerContainer.classList.add("answer-single-container");
        divAnswerContainer.append(divSingleAnswerContainer);

        var inputCheckbox = document.createElement("input");
        inputCheckbox.id = "question-" + question.getId() + "-" + "answer-checkbox-" + question.answers[i].getId();
        inputCheckbox.setAttribute("type", "checkbox");
        inputCheckbox.checked = question.getAnswerIsCorrect(i);
        divSingleAnswerContainer.append(inputCheckbox);
        question.addCheckboxEventListener(question.answers[i].getId(), inputCheckbox);

        var labelAnswer = document.createElement("label");
        labelAnswer.setAttribute("for", "question-" + question.getId() + "-" + "answer-input-" + question.answers[i].getId());
        labelAnswer.id = "question-" + question.getId() + "-" + "answer-label-" + question.answers[i].getId();
        labelAnswer.innerText = intToAlphabet(question.answers[i].getOrderPosition()) + ") ";
        labelAnswer.classList.add("label-answer");
        divSingleAnswerContainer.append(labelAnswer);

        var inputAnswer = document.createElement("textarea");
        inputAnswer.setAttribute("rows", "1");
        inputAnswer.id = "question-" + question.getId() + "-" + "answer-input-" + question.answers[i].getId();
        inputAnswer.setAttribute("type", "text");
        inputAnswer.value = question.answers[i].getText();
        inputAnswer.classList.add("input-answer");
        if (question.getQuestionType() === enumQuestions.TrueFalse) {
            inputAnswer.setAttribute("disabled", "");
        }
        divSingleAnswerContainer.append(inputAnswer);

        if (question.getQuestionType() !== enumQuestions.TrueFalse && question.getQuestionType() !== enumQuestions.Essay) {
            question.addAnswerTextInputEventListener(i, inputAnswer);
            question.answers[i].updateTextAreaSize();
        }
    }

    // Add event listener to question class
    question.addTextInputEventListener(inputQuestion);
    question.addDropdownInputEventListener(selectQuestionType);

    // Run any formatting functions
    question.updateTextAreaSize();
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
        var questionText = questions[questionKeys[i]].getText();
        // If the question is multi-line, format the tabbing
        questionText = questionText.replace(/\n/gi, "\n\t");

        text = text + (i + 1).toString() + ". " + questionText;

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


async function importExistingQuiz(file) {
    let text = await file.text();
    parseQuizTxt(text);
    updateDisplayQuestions(true);
}

function parseQuizTxt(text) {
    const questionAnswerArray = text.split('\n\n');
    // console.log(questionAnswerArray);

    for (var i = 0; i < questionAnswerArray.length; i++) {
        const questionSepArray = questionAnswerArray[i].split("\n");

        // Get questions string and answers array
        var onQuestion = true;
        var questionText = "";
        var answers = [];
        for (var j = 0; j < questionSepArray.length; j++) {
            if (onQuestion) {
                if (j > 0 && questionSepArray[j][0] != '\t') {
                    onQuestion = false;
                    answers.push(questionSepArray[j]);
                }
                else {
                    questionText = questionText + questionSepArray[j];
                }
            }
            else {
                answers.push(questionSepArray[j]);
            }
        }
        if (questionText == "")
            break;
        // Format questionText to not have it's number
        var rem = questionText[0];
        do {
            rem = questionText[0];
            questionText = questionText.slice(1);

        } while (rem != '.')
        questionText = questionText.slice(1);

        // Create the question
        addNewQuestion(questionText, false);

        // Create answers
        // If question is essay
        if (answers[0] == '___') {
            questions[i].setQuestionType(enumQuestions.Essay);
        }
        else {
            for (var j = 0; j < answers.length; j++) {
                var correctFlag = false;
                if (answers[j] == "" || answers[j] == " " || answers[j] === undefined)
                    continue;
                if (answers[j][0] == "[" && answers[j][1] == "*")
                    correctFlag = true;
                else if (answers[j][0] == "*")
                    correctFlag = true;

                var rem = "";
                do {
                    rem = answers[j][0];
                    answers[j] = answers[j].slice(1);

                } while (rem != ')' && rem != ']' && rem !== undefined)
                answers[j] = answers[j].slice(1);

                addNewAnswer(i, answers[j], false);
                questions[i].setAnswerCorrectedness(j, correctFlag)
            }
            if (questions[i].getAnswersLength() == 2 && questions[i].answers[0].getText() == "True" && questions[i].answers[1].getText() == "False") {
                questions[i].setQuestionType(enumQuestions.TrueFalse);
            }
            else if (questions[i].getNumberOfCorrectAnswers() > 1) {
                questions[i].setQuestionType(enumQuestions.MultipleAnswers);
            }
        }

    }
}