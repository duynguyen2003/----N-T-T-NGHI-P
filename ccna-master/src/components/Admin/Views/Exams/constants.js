export const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const difficultyOptions = [
  { value: '', label: 'Không chọn' },
  { value: 'EASY', label: 'Dễ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HARD', label: 'Khó' }
];

export const correctAnswerOptions = OPTION_LABELS.map((lbl, i) => ({
  value: i,
  label: `Đáp án ${lbl}`
}));

export const defaultFormData = {
  title: '',
  examCode: '',
  totalQuestions: 0,
  durationMinutes: 60,
  passingScore: 70,
  difficulty: '',
  courseId: '',
  moduleId: ''
};

export const defaultQuestionDraft = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  imageUrl: ''
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'OPEN', label: 'Đang mở' },
  { value: 'DRAFT', label: 'Nháp' }
];
