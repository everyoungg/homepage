import 'package:flutter/material.dart';
import 'screens/chat_screen.dart';
import 'screens/home_screen.dart';
import 'screens/workout_screen.dart';
import 'screens/settings_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'providers/chat_provider.dart';
import 'package:url_launcher/url_launcher.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ChatProvider(),
      child: MaterialApp(
        title: 'Fit Buddy',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1976D2)), // 진한 하늘색
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFE3F2FD), // 연한 하늘색 배경
        ),
        home: const WelcomeScreen(),
      ),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome FitBuddy',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
            const SizedBox(height: 60),
            ElevatedButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const UserInfoScreen()),
                );
              },
              child: const Text('시작하기', style: TextStyle(fontSize: 20)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 18),
                backgroundColor: const Color(0xFF1976D2), // 진한 하늘색
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const WorkoutScreen(),
    const ChatScreen(),
    const SettingsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '홈',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: '운동',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: '챗봇',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: '설정',
          ),
        ],
      ),
    );
  }
}

class UserInfoScreen extends StatefulWidget {
  const UserInfoScreen({super.key});

  @override
  State<UserInfoScreen> createState() => _UserInfoScreenState();
}

class _UserInfoScreenState extends State<UserInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _age = '';
  String _height = '';
  String _weight = '';
  String _gender = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('정보 입력'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: '이름'),
                onSaved: (value) => _name = value ?? '',
                validator: (value) => value == null || value.isEmpty ? '이름을 입력하세요' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: '나이'),
                keyboardType: TextInputType.number,
                onSaved: (value) => _age = value ?? '',
                validator: (value) => value == null || value.isEmpty ? '나이를 입력하세요' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: '키 (cm)'),
                keyboardType: TextInputType.number,
                onSaved: (value) => _height = value ?? '',
                validator: (value) => value == null || value.isEmpty ? '키를 입력하세요' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: '몸무게 (kg)'),
                keyboardType: TextInputType.number,
                onSaved: (value) => _weight = value ?? '',
                validator: (value) => value == null || value.isEmpty ? '몸무게를 입력하세요' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: '성별'),
                items: const [
                  DropdownMenuItem(value: '남성', child: Text('남성')),
                  DropdownMenuItem(value: '여성', child: Text('여성')),
                  DropdownMenuItem(value: '기타', child: Text('기타')),
                ],
                onChanged: (value) => setState(() => _gender = value ?? ''),
                validator: (value) => value == null || value.isEmpty ? '성별을 선택하세요' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() ?? false) {
                    _formKey.currentState?.save();
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const WorkoutGoalScreen()),
                    );
                  }
                },
                child: const Text('다음', style: TextStyle(fontSize: 18)),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class WorkoutGoalScreen extends StatefulWidget {
  const WorkoutGoalScreen({super.key});

  @override
  State<WorkoutGoalScreen> createState() => _WorkoutGoalScreenState();
}

class _WorkoutGoalScreenState extends State<WorkoutGoalScreen> {
  String? _selectedGoal;

  final List<String> _goals = [
    '건강증진',
    '체중감량',
    '벌크업',
    '라인정리',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('운동 목적'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '운동 목적을 선택해주세요',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            ..._goals.map((goal) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedGoal = goal;
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: _selectedGoal == goal ? Colors.blue : Colors.grey[200],
                  foregroundColor: _selectedGoal == goal ? Colors.white : Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Text(goal, style: const TextStyle(fontSize: 18)),
              ),
            )).toList(),
            const Spacer(),
            ElevatedButton(
              onPressed: _selectedGoal == null
                  ? null
                  : () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TargetAreaScreen(),
                        ),
                      );
                    },
              child: const Text('다음', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TargetAreaScreen extends StatefulWidget {
  const TargetAreaScreen({super.key});

  @override
  State<TargetAreaScreen> createState() => _TargetAreaScreenState();
}

class _TargetAreaScreenState extends State<TargetAreaScreen> {
  final List<String> _targetAreas = [
    '팔',
    '어깨',
    '가슴',
    '다리',
    '복부',
    '전신',
  ];

  final Set<String> _selectedAreas = {};

  void _navigateToNextScreen(String area) {
    if (area == '전신') {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const FullBodyWorkoutScreen(),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => WorkoutStartScreen(area: area),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('타겟 부위'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '운동하고 싶은 부위를 선택해주세요',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 2.5,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: _targetAreas.length,
                itemBuilder: (context, index) {
                  final area = _targetAreas[index];
                  return FilterChip(
                    label: Text(area),
                    selected: _selectedAreas.contains(area),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedAreas.add(area);
                          _navigateToNextScreen(area);
                        } else {
                          _selectedAreas.remove(area);
                        }
                      });
                    },
                    backgroundColor: Colors.grey.shade200,
                    selectedColor: Colors.blue.shade100,
                    checkmarkColor: Colors.blue,
                    labelStyle: TextStyle(
                      color: _selectedAreas.contains(area)
                          ? Colors.blue
                          : Colors.black87,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DetailedArmScreen extends StatefulWidget {
  const DetailedArmScreen({super.key});

  @override
  State<DetailedArmScreen> createState() => _DetailedArmScreenState();
}

class _DetailedArmScreenState extends State<DetailedArmScreen> {
  String? _selectedPart;

  final List<String> _armParts = [
    '이두',
    '삼두',
    '전완근',
    '전체',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('팔 운동'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '운동하고 싶은 부위를 선택해주세요',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            ..._armParts.map((part) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: RadioListTile<String>(
                title: Text(part),
                value: part,
                groupValue: _selectedPart,
                onChanged: (value) {
                  setState(() {
                    _selectedPart = value;
                  });
                },
                activeColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                  side: BorderSide(color: Colors.blue.shade200),
                ),
              ),
            )).toList(),
            const Spacer(),
            ElevatedButton(
              onPressed: _selectedPart == null
                  ? null
                  : () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => WorkoutStartScreen(
                            area: '팔',
                            subArea: _selectedPart!,
                          ),
                        ),
                      );
                    },
              child: const Text('다음', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DetailedShoulderScreen extends StatefulWidget {
  const DetailedShoulderScreen({super.key});

  @override
  State<DetailedShoulderScreen> createState() => _DetailedShoulderScreenState();
}

class _DetailedShoulderScreenState extends State<DetailedShoulderScreen> {
  String? _selectedPart;

  final List<String> _shoulderParts = [
    '전면삼각근',
    '후면삼각근',
    '측면삼각근',
    '전체',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('어깨 운동'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '운동하고 싶은 부위를 선택해주세요',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            ..._shoulderParts.map((part) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: RadioListTile<String>(
                title: Text(part),
                value: part,
                groupValue: _selectedPart,
                onChanged: (value) {
                  setState(() {
                    _selectedPart = value;
                  });
                },
                activeColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                  side: BorderSide(color: Colors.blue.shade200),
                ),
              ),
            )).toList(),
            const Spacer(),
            ElevatedButton(
              onPressed: _selectedPart == null
                  ? null
                  : () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => WorkoutStartScreen(
                            area: '어깨',
                            subArea: _selectedPart!,
                          ),
                        ),
                      );
                    },
              child: const Text('다음', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class WorkoutStartScreen extends StatelessWidget {
  final String area;
  final String? subArea;

  const WorkoutStartScreen({
    super.key,
    required this.area,
    this.subArea,
  });

  void _startWorkout(BuildContext context) {
    // 웹 데모 페이지를 새 창에서 열기
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('운동 시작'),
        content: const Text('운동을 시작하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // 웹 데모 페이지 열기
              launchUrl(
                Uri.parse('http://localhost:8000/workout.html'),
                mode: LaunchMode.externalApplication,
              );
            },
            child: const Text('시작'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              subArea != null
                  ? '$area($subArea) 운동을 시작할게요!'
                  : '$area 운동을 시작할게요!',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => _startWorkout(context),
              child: const Text('네', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 18),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class FullBodyWorkoutScreen extends StatefulWidget {
  const FullBodyWorkoutScreen({super.key});

  @override
  State<FullBodyWorkoutScreen> createState() => _FullBodyWorkoutScreenState();
}

class _FullBodyWorkoutScreenState extends State<FullBodyWorkoutScreen> {
  String? _selectedWorkout;

  final List<Map<String, dynamic>> _workouts = [
    {
      'name': '스쿼트',
      'description': '하체와 코어를 강화하는 기본 운동',
      'icon': Icons.fitness_center,
    },
    {
      'name': '런지',
      'description': '하체 근력과 균형 감각을 향상하는 운동',
      'icon': Icons.fitness_center,
    },
    {
      'name': '플랭크',
      'description': '코어와 전신 안정성을 강화하는 운동',
      'icon': Icons.accessibility_new,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('전신 운동'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '원하는 운동을 선택해주세요',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            ..._workouts.map((workout) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Card(
                elevation: 4,
                child: RadioListTile<String>(
                  title: Row(
                    children: [
                      Icon(workout['icon'], color: Colors.blue),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            workout['name'],
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            workout['description'],
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  value: workout['name'],
                  groupValue: _selectedWorkout,
                  onChanged: (value) {
                    setState(() {
                      _selectedWorkout = value;
                    });
                  },
                  activeColor: Colors.blue,
                ),
              ),
            )).toList(),
            const Spacer(),
            ElevatedButton(
              onPressed: _selectedWorkout == null
                  ? null
                  : () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => WorkoutStartScreen(
                            area: '전신',
                            subArea: _selectedWorkout!,
                          ),
                        ),
                      );
                    },
              child: const Text('다음', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
