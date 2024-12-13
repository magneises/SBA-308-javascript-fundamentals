
// Assignment Data 
// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];

// Learner Data Exercise  
function getLearnerData(courseInfo, assignmentGroups, learnerSubmissions) {
    try {
        assignmentGroups.forEach(group => {
            if (group.course_id !== courseInfo.id) {
                throw new Error(`Invalid data: AssignmentGroup ${group.id} does not belong to Course ${courseInfo.id}`);
            }
        });

        const assignmentsMap = {};
        assignmentGroups.forEach(group => {
            group.assignments.forEach(assignment => {
                assignmentsMap[assignment.id] = {
                    ...assignment,
                    groupWeight: group.group_weight
                };
            });
        });

        const learnerData = {};
        learnerSubmissions.forEach(submission => {
            const { learner_id, assignment_id, submission: subData } = submission;
            const assignment = assignmentsMap[assignment_id];

            if (!assignment) {
                throw new Error(`Invalid data: Assignment ${assignment_id} does not exist.`);
            }

            const dueDate = new Date(assignment.due_at);
            const submittedAt = new Date(subData.submitted_at);

            if (Date.now() < dueDate) {
                return;
            }

            let score = subData.score;
            if (submittedAt > dueDate) {
                score -= assignment.points_possible * 0.1; 
            }

            score = Math.max(0, score);

            if (!learnerData[learner_id]) {
                learnerData[learner_id] = {
                    id: learner_id,
                    avg: 0,
                    totalPointsEarned: 0,
                    totalPointsPossible: 0,
                    assignments: {}
                };
            }

            const learner = learnerData[learner_id];

            const percentage = score / assignment.points_possible;
            learner.assignments[assignment_id] = percentage * 100; 

            learner.totalPointsEarned += score * assignment.groupWeight;
            learner.totalPointsPossible += assignment.points_possible * assignment.groupWeight;
        });

        return Object.values(learnerData).map(learner => {
            learner.avg = learner.totalPointsPossible > 0
                ? (learner.totalPointsEarned / learner.totalPointsPossible) * 100
                : 0;

            delete learner.totalPointsEarned;
            delete learner.totalPointsPossible;

            return learner;
        });

    } catch (error) {
        console.error("Error processing data:", error.message);
        throw error;
    }
}

const result = getLearnerData(CourseInfo, [AssignmentGroup], LearnerSubmissions);
console.log(result);
