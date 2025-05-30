import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';

Dimensions.get('window');

interface CalendarDay {
  day: string;
  date: number;
}

interface TaskItem {
  id: string;
  title: string;
  time: string;
  type: 'Habit' | 'Task';
  priority: 'Must' | 'Important';
  icon: string;
  progress?: string;
  completed?: boolean;
}

interface TaskTypeOption {
  id: string;
  title: string;
  description: string;
  iconComponent: React.ReactNode;
}

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(18);
  const [modalVisible, setModalVisible] = useState(false);
  
  const calendarDays: CalendarDay[] = [
    { day: 'Sun', date: 15 },
    { day: 'Mon', date: 16 },
    { day: 'Tue', date: 17 },
    { day: 'Wed', date: 18 },
    { day: 'Thu', date: 19 },
    { day: 'Fri', date: 20 },
    { day: 'Sat', date: 21 },
  ];

  const tasks: TaskItem[] = [
    {
      id: '1',
      title: 'Schedule a meeting with Harshit Sir',
      time: '09:00 AM',
      type: 'Habit',
      priority: 'Must',
      icon: 'meeting',
      completed: true,
    },
    {
      id: '2',
      title: '2.5 Hours Simran and Meditation',
      time: '09:00 AM',
      type: 'Habit',
      priority: 'Must',
      icon: 'meditation',
      completed: false,
    },
    {
      id: '3',
      title: 'Save 200 Rupees Daily',
      time: '12:00 PM',
      type: 'Habit',
      priority: 'Must',
      icon: 'money',
      completed: false,
    },
    {
      id: '4',
      title: 'Walk 10k Step Daily',
      time: '07:00 AM',
      type: 'Habit',
      priority: 'Important',
      icon: 'walking',
      progress: '12/31',
      completed: false,
    },
    {
      id: '5',
      title: 'Buy Sunflower for Mumma',
      time: '11:00 AM',
      type: 'Task',
      priority: 'Important',
      icon: 'shopping',
      progress: '0/1',
      completed: false,
    },
    {
      id: '6',
      title: 'Make Mandala and Colour Daily',
      time: '07:30 PM',
      type: 'Task',
      priority: 'Important',
      icon: 'art',
      progress: '12/30',
      completed: false,
    },
  ];

  // Brain Icon Component
  const BrainIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.brainMain}>
        <View style={styles.brainLeft} />
        <View style={styles.brainRight} />
      </View>
      <View style={styles.brainStem} />
    </View>
  );

  // Recurring Icon Component (Two curved arrows)
  const RecurringIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.recurringArrow1} />
      <View style={styles.recurringArrow2} />
    </View>
  );

  // Task Icon Component (Checkmark)
  const TaskIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.checkmarkContainer}>
        <View style={styles.checkmarkLine1} />
        <View style={styles.checkmarkLine2} />
      </View>
    </View>
  );

  // Goal Icon Component (Target/Bullseye)
  const GoalIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.targetOuter}>
        <View style={styles.targetMiddle}>
          <View style={styles.targetInner} />
        </View>
      </View>
    </View>
  );

  const taskTypeOptions: TaskTypeOption[] = [
    {
      id: 'habit',
      title: 'Habit',
      description: 'Activity that repeats over time it has detailed tracking and statistics.',
      iconComponent: <BrainIcon />,
    },
    {
      id: 'recurring',
      title: 'Recurring Task',
      description: 'Activity that repeats over time it has detailed tracking and statistics.',
      iconComponent: <RecurringIcon />,
    },
    {
      id: 'task',
      title: 'Task',
      description: 'Single instance activity without tracking over time.',
      iconComponent: <TaskIcon />,
    },
    {
      id: 'goal',
      title: 'Goal of the Day',
      description: 'A specific target set for oneself to achieve within a single day.',
      iconComponent: <GoalIcon />,
    },
  ];

  const renderCalendarDay = (item: CalendarDay, index: number) => {
    const isSelected = item.date === selectedDate;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.calendarDay, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {item.day}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTaskItem = (task: TaskItem) => {
    return (
      <View key={task.id} style={styles.taskItem}>
        <View style={styles.taskIconContainer}>
          <Image
            source={{ uri: `placeholder_${task.icon}` }}
            style={styles.taskIcon}
            defaultSource={require('./assets/placeholder.png')}
          />
        </View>
        
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.taskMeta}>
            <View style={styles.timeContainer}>
              <View style={[styles.timeIcon, getTimeIconColor(task.time)]} />
              <Text style={[styles.timeText, getTimeTextColor(task.time)]}>{task.time}</Text>
            </View>
            <Text style={styles.taskType}>
              {task.type} | {task.priority}
            </Text>
            {task.progress && (
              <Text style={styles.progressText}>{task.progress}</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.taskAction}>
          {task.completed ? (
            <View style={styles.completedCheck}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          ) : (
            <View style={styles.incompleteCheck} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const getTimeIconColor = (time: string) => {
    if (time.includes('09:00')) return styles.blueTimeIcon;
    if (time.includes('12:00')) return styles.yellowTimeIcon;
    if (time.includes('07:00') || time.includes('07:30')) return styles.greenTimeIcon;
    if (time.includes('11:00')) return styles.orangeTimeIcon;
    return styles.blueTimeIcon;
  };

  const getTimeTextColor = (time: string) => {
    if (time.includes('09:00')) return { color: '#4A90E2' };
    if (time.includes('12:00')) return { color: '#F5A623' };
    if (time.includes('07:00') || time.includes('07:30')) return { color: '#7ED321' };
    if (time.includes('11:00')) return { color: '#F5A623' };
    return { color: '#4A90E2' };
  };

  const renderTaskTypeOption = (option: TaskTypeOption) => {
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.taskTypeOption}
        onPress={() => {
          // Handle task type selection
          setModalVisible(false);
        }}
      >
        <View style={styles.taskTypeIconWrapper}>
          {option.iconComponent}
        </View>
        <View style={styles.taskTypeContent}>
          <Text style={styles.taskTypeTitle}>{option.title}</Text>
          <Text style={styles.taskTypeDescription}>{option.description}</Text>
        </View>
        <Text style={styles.taskTypeArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            defaultSource={require('./assets/placeholder.png')}
          />
          <Text style={styles.appName}>WingsFly</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <View style={styles.searchIcon}>
              <View style={styles.searchCircle} />
              <View style={styles.searchHandle} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <View style={styles.calendarIcon}>
              <View style={styles.calendarTop} />
              <View style={styles.calendarBody}>
                <View style={styles.calendarLine} />
                <View style={styles.calendarLine} />
                <View style={styles.calendarLine} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <View style={styles.questionIcon}>
              <Text style={styles.questionText}>?</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendar}>
          {calendarDays.map(renderCalendarDay)}
        </View>

        {/* Today's Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteHeader}>Today's Quote</Text>
          <Text style={styles.quote}>
            "You must do the things, you think you cannot do."
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progress 65%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
          </View>
        </View>

        {/* Tasks */}
        <View style={styles.tasksContainer}>
          {tasks.map(renderTaskItem)}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {taskTypeOptions.map(renderTaskTypeOption)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2E3A8C',
    marginRight: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  // Search Icon
  searchIcon: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666666',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 6,
    height: 2,
    backgroundColor: '#666666',
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate: '45deg' }],
  },
  // Calendar Icon
  calendarIcon: {
    width: 16,
    height: 18,
  },
  calendarTop: {
    width: 16,
    height: 4,
    backgroundColor: '#666666',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: 1,
  },
  calendarBody: {
    width: 16,
    height: 13,
    borderWidth: 1,
    borderColor: '#666666',
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingTop: 2,
    paddingHorizontal: 2,
  },
  calendarLine: {
    height: 1,
    backgroundColor: '#666666',
    marginBottom: 1,
  },
  // Question Icon
  questionIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  calendarDay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 65,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  selectedDay: {
    backgroundColor: '#2E3A8C',
  },
  dayText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  quote: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'flex-start',
  },
  progressLabel: {
    fontSize: 14,
    color: '#2E3A8C',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E3A8C',
    borderRadius: 3,
  },
  tasksContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIcon: {
    width: 24,
    height: 24,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 22,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  timeIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  blueTimeIcon: {
    backgroundColor: '#4A90E2',
  },
  yellowTimeIcon: {
    backgroundColor: '#F5A623',
  },
  greenTimeIcon: {
    backgroundColor: '#7ED321',
  },
  orangeTimeIcon: {
    backgroundColor: '#F5A623',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskType: {
    fontSize: 12,
    color: '#666666',
    marginRight: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
  },
  taskAction: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  incompleteCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E3A8C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
    paddingTop: 20,
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  taskTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskTypeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskTypeContent: {
    flex: 1,
  },
  taskTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  taskTypeDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  taskTypeArrow: {
    fontSize: 20,
    color: '#CCCCCC',
    marginLeft: 10,
  },
 
  // Icon Component Styles
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Brain Icon
  brainMain: {
    width: 16,
    height: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2E3A8C',
    position: 'relative',
    flexDirection: 'row',
  },
  brainLeft: {
    width: 6,
    height: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2E3A8C',
    position: 'absolute',
    left: 2,
    top: 1,
  },
  brainRight: {
    width: 6,
    height: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2E3A8C',
    position: 'absolute',
    right: 2,
    top: 1,
  },
  brainStem: {
    width: 3,
    height: 4,
    backgroundColor: '#2E3A8C',
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
  },
  // Recurring Icon (Two curved arrows)
  recurringArrow1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E3A8C',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: -2,
    left: 2,
  },
  recurringArrow2: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E3A8C',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: -2,
    right: 2,
  },
  // Checkmark Icon
  checkmarkContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkLine1: {
    width: 6,
    height: 2,
    backgroundColor: '#2E3A8C',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    left: 2,
    top: 8,
  },
  checkmarkLine2: {
    width: 10,
    height: 2,
    backgroundColor: '#2E3A8C',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    right: 1,
    top: 6,
  },
  // Target/Goal Icon
  targetOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2E3A8C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetMiddle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#2E3A8C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2E3A8C',
  },
});
export default HomeScreen;