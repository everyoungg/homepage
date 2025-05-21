import 'package:flutter/material.dart';
import 'screens/chat_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'providers/chat_provider.dart';

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
          // This is the theme of your application.
          //
          // TRY THIS: Try running your application with "flutter run". You'll see
          // the application has a purple toolbar. Then, without quitting the app,
          // try changing the seedColor in the colorScheme below to Colors.green
          // and then invoke "hot reload" (save your changes or press the "hot
          // reload" button in a Flutter-supported IDE, or press "r" if you used
          // the command line to start the app).
          //
          // Notice that the counter didn't reset back to zero; the application
          // state is not lost during the reload. To reset the state, use hot
          // restart instead.
          //
          // This works for code too, not just values: Most code changes can be
          // tested with just a hot reload.
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
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
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const UserInfoScreen()),
                );
              },
              child: const Text('시작하기', style: TextStyle(fontSize: 20)),
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
    '등',
    '복부',
    '엉덩이',
    '전신',
  ];

  final Set<String> _selectedAreas = {};

  void _navigateToNextScreen(String area) {
    if (area == '팔') {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const DetailedArmScreen(),
        ),
      );
    } else if (area == '어깨') {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const DetailedShoulderScreen(),
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
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const ChatScreen()),
                );
              },
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
