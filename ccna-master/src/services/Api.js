// fe/src/services/api.js

// --- CẤU HÌNH ---
// Nếu chạy Backend (Node.js) thì dùng link này:
const API_URL = "http://localhost:5000/api";

// Hàm delay giả lập mạng (dùng cho Mock Data)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =================================================================
// PHẦN 1: MOCK DATA (DỮ LIỆU GIẢ)
// Dùng khi bạn chưa chạy Backend, chỉ muốn test giao diện Frontend
// =================================================================

const MOCK_COURSES = [
  {
    id: "c1",
    code: "ITN",
    title: "Introduction to Networks",
    description:
      "Khóa học nền tảng về kiến trúc, mô hình và các thành phần mạng (IPv4, IPv6).",
    progress: 100,
    modules: [
      {
        id: "m1",
        title: "Networking Today",
        description: "Ảnh hưởng của mạng.",
        status: "completed",
      },
      {
        id: "m2",
        title: "Basic Switch Config",
        description: "Cấu hình Switch & End Device.",
        status: "completed",
      },
      {
        id: "m3",
        title: "Protocol Models",
        description: "Mô hình OSI & TCP/IP.",
        status: "completed",
      },
    ],
  },
  {
    id: "c2",
    code: "SRWE",
    title: "Switching, Routing, and Wireless",
    description:
      "Kiến thức chuyển mạch, định tuyến nâng cao và mạng không dây (WLAN).",
    progress: 35,
    modules: [
      {
        id: "s1",
        title: "VLANs Concepts",
        description: "Phân đoạn mạng với VLAN.",
        status: "completed",
      },
      {
        id: "s2",
        title: "Inter-VLAN Routing",
        description: "Định tuyến giữa các VLAN.",
        status: "active",
      },
      {
        id: "s3",
        title: "STP Concepts",
        description: "Giao thức Spanning Tree.",
        status: "locked",
      },
    ],
  },
  {
    id: "c3",
    code: "ENSA",
    title: "Enterprise Networking & Automation",
    description:
      "Mạng doanh nghiệp diện rộng (WAN), bảo mật và tự động hóa mạng.",
    progress: 0,
    modules: [
      {
        id: "e1",
        title: "OSPFv2",
        description: "Giao thức định tuyến OSPF.",
        status: "locked",
      },
      {
        id: "e2",
        title: "Network Security",
        description: "VPN & IPsec.",
        status: "locked",
      },
      {
        id: "e3",
        title: "Automation",
        description: "SDN, APIs, Ansible.",
        status: "locked",
      },
    ],
  },
];

const MOCK_LABS = [
  {
    id: "1",
    title: "Basic Switch Configuration",
    category: "Switching",
    difficulty: "Easy",
    duration: "30 min",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tools: ["Packet Tracer"],
    fileUrl: "#",
    topology: "PC1 ──── [SW1] ──── PC2",
    objective: "Cấu hình hostname, password và VLAN management trên Switch Cisco.",
    steps: [
      {
        title: "Vào chế độ privileged EXEC",
        commands: ["Switch> enable", "Switch# "],
        note: "Dấu # cho biết bạn đã vào privileged mode thành công.",
      },
      {
        title: "Cấu hình hostname",
        commands: ["Switch# configure terminal", "Switch(config)# hostname SW1", "SW1(config)# "],
        note: "Hostname giúp nhận diện thiết bị trong môi trường mạng doanh nghiệp.",
      },
      {
        title: "Đặt enable password",
        commands: ["SW1(config)# enable secret Cisco@123", "SW1(config)# "],
        note: "Dùng 'enable secret' thay vì 'enable password' để mã hóa mạnh hơn.",
      },
      {
        title: "Lưu cấu hình",
        commands: ["SW1# copy running-config startup-config", "Destination filename [startup-config]? ", "[Enter]"],
        note: "Luôn lưu cấu hình sau mỗi thay đổi quan trọng.",
      },
    ],
  },
  {
    id: "2",
    title: "VLANs & Trunking Design",
    category: "Switching",
    difficulty: "Medium",
    duration: "45 min",
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=800&q=80",
    tools: ["EVE-NG"],
    fileUrl: "#",
    topology: "PC-Sales ─[Fa0/1]─ [SW1] ─[Trunk]─ [SW2] ─[Fa0/2]─ PC-IT",
    objective: "Cấu hình VLAN 10 (Sales) và VLAN 20 (IT), thiết lập Trunk port giữa 2 Switch.",
    steps: [
      {
        title: "Tạo VLAN trên SW1",
        commands: [
          "SW1(config)# vlan 10",
          "SW1(config-vlan)# name SALES",
          "SW1(config-vlan)# vlan 20",
          "SW1(config-vlan)# name IT",
          "SW1(config-vlan)# exit",
        ],
        note: "Mỗi VLAN tạo ra một broadcast domain riêng biệt.",
      },
      {
        title: "Gán port vào VLAN",
        commands: [
          "SW1(config)# interface FastEthernet 0/1",
          "SW1(config-if)# switchport mode access",
          "SW1(config-if)# switchport access vlan 10",
        ],
        note: "Access port chỉ thuộc về một VLAN duy nhất.",
      },
      {
        title: "Cấu hình Trunk port",
        commands: [
          "SW1(config)# interface GigabitEthernet 0/1",
          "SW1(config-if)# switchport mode trunk",
          "SW1(config-if)# switchport trunk allowed vlan 10,20",
        ],
        note: "Trunk port cho phép nhiều VLAN đi qua cùng một đường dây vật lý.",
      },
      {
        title: "Kiểm tra cấu hình",
        commands: ["SW1# show vlan brief", "SW1# show interfaces trunk"],
        note: "Xác minh các VLAN và trunk đã được cấu hình đúng.",
      },
    ],
  },
  {
    id: "3",
    title: "OSPF Single Area Config",
    category: "Routing",
    difficulty: "Hard",
    duration: "60 min",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    tools: ["GNS3"],
    fileUrl: "#",
    topology: "[R1:192.168.1.1] ──── [R2:192.168.1.2] ──── [R3:192.168.1.3]",
    objective: "Cấu hình OSPF Area 0 trên 3 Router, kiểm tra neighbor adjacency và bảng định tuyến.",
    steps: [
      {
        title: "Bật OSPF trên R1",
        commands: [
          "R1(config)# router ospf 1",
          "R1(config-router)# router-id 1.1.1.1",
          "R1(config-router)# network 192.168.1.0 0.0.0.255 area 0",
          "R1(config-router)# network 10.0.0.0 0.0.0.255 area 0",
        ],
        note: "Process ID (1) chỉ có ý nghĩa local, không cần khớp với router khác.",
      },
      {
        title: "Cấu hình tương tự trên R2 và R3",
        commands: [
          "R2(config)# router ospf 1",
          "R2(config-router)# router-id 2.2.2.2",
          "R2(config-router)# network 192.168.1.0 0.0.0.255 area 0",
        ],
        note: "Router-ID phải là duy nhất trong toàn bộ OSPF domain.",
      },
      {
        title: "Kiểm tra OSPF neighbors",
        commands: [
          "R1# show ip ospf neighbor",
          "R1# show ip route ospf",
          "R1# show ip ospf interface brief",
        ],
        note: "Neighbor state phải là FULL để trao đổi routing information thành công.",
      },
    ],
  },
  {
    id: "4",
    title: "ACLs Security Implementation",
    category: "Security",
    difficulty: "Medium",
    duration: "50 min",
    imageUrl:
      "https://images.unsplash.com/photo-1563206767-5b1d97299337?auto=format&fit=crop&w=800&q=80",
    tools: ["Packet Tracer"],
    fileUrl: "#",
    topology: "PC-Admin(192.168.1.0/24) ─── [R1] ─── Server(10.0.0.0/24)",
    objective: "Tạo Standard ACL chặn mạng 192.168.2.0/24 truy cập Server, cho phép mạng Admin.",
    steps: [
      {
        title: "Tạo Standard ACL",
        commands: [
          "R1(config)# ip access-list standard BLOCK_GUEST",
          "R1(config-std-nacl)# deny 192.168.2.0 0.0.0.255",
          "R1(config-std-nacl)# permit any",
        ],
        note: "Standard ACL chỉ lọc dựa trên Source IP. Nên đặt gần đích (destination) nhất.",
      },
      {
        title: "Áp dụng ACL vào interface",
        commands: [
          "R1(config)# interface GigabitEthernet 0/1",
          "R1(config-if)# ip access-group BLOCK_GUEST out",
        ],
        note: "'out' nghĩa là lọc traffic đi ra khỏi interface đó.",
      },
      {
        title: "Kiểm tra ACL",
        commands: [
          "R1# show ip access-lists",
          "R1# show running-config | include access",
        ],
        note: "Cột 'matches' cho biết số gói tin đã bị match bởi ACL rule.",
      },
    ],
  },
];


const MOCK_PROFILE = {
  totalProgress: 45,
  courseProgress: { ITN: 100, SRWE: 35, ENSA: 0 },
  streak: 12,
  badges: ["Early Bird", "Lab Master", "Subnetting Hero"],
  recentActivity: [
    {
      id: 1,
      title: "Lab: OSPF Configuration",
      type: "Lab",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Lesson: VLAN Concepts",
      type: "Lesson",
      timestamp: "1 day ago",
    },
  ],
};

// =================================================================
// PHẦN 2: API EXPORT (Hàm gọi dữ liệu)
// =================================================================

export const api = {
  // ========================
  // AUTH APIs
  // ========================

  // Đăng ký tài khoản mới
  register: async (fullName, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: async (token) => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Logout API error:', error);
    }
  },

  // ========================
  // DATA APIs
  // ========================

  // 1. Lấy danh sách khóa học
  getCourses: async () => {
    try {
      // --- CÁCH 1: Gọi Server thật (Bỏ comment dòng dưới nếu đã chạy Backend) ---
      // const response = await fetch(`${API_URL}/courses`);
      // if (!response.ok) throw new Error('Failed to fetch courses');
      // return await response.json();

      // --- CÁCH 2: Dùng Mock Data (Mặc định) ---
      await delay(600); // Giả vờ mạng chậm
      return MOCK_COURSES;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return []; // Trả về mảng rỗng để không crash app
    }
  },

  // 2. Lấy danh sách bài Lab
  getLabs: async () => {
    try {
      // const response = await fetch(`${API_URL}/labs`);
      // if (!response.ok) throw new Error('Failed to fetch labs');
      // return await response.json();

      await delay(500);
      return MOCK_LABS;
    } catch (error) {
      console.error("Error fetching labs:", error);
      return [];
    }
  },

  // 3. Lấy thông tin User (Profile)
  getUserProfile: async () => {
    try {
      // const response = await fetch(`${API_URL}/user/profile`);
      // return await response.json();

      await delay(400);
      return MOCK_PROFILE;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },
};

export default api;
