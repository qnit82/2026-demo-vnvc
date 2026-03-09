USE [TEST_DB]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PID] [nvarchar](20) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[DOB] [datetime2](7) NOT NULL,
	[Gender] [nvarchar](10) NOT NULL,
	[Phone] [nvarchar](15) NOT NULL,
	[Address] [nvarchar](250) NOT NULL,
	[ParentId] [int] NULL,
	[GuardianName] [nvarchar](100) NULL,
	[GuardianPhone] [nvarchar](15) NULL,
	[GuardianRelation] [nvarchar](50) NULL,
	[IdentityCard] [nvarchar](12) NULL,
	[MedicalHistory] [nvarchar](max) NULL,
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InjectionLogs]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InjectionLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PrescriptionId] [int] NOT NULL,
	[NurseId] [int] NULL,
	[BatchId] [int] NOT NULL,
	[InjectionSite] [nvarchar](max) NOT NULL,
	[InjectionTime] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_InjectionLogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoices](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VisitId] [int] NOT NULL,
	[TotalAmount] [decimal](18, 2) NOT NULL,
	[PaymentStatus] [int] NOT NULL,
	[PaymentTime] [datetime2](7) NULL,
 CONSTRAINT [PK_Invoices] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[VaccineId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_OrderDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VisitId] [int] NOT NULL,
	[OrderNumber] [nvarchar](20) NOT NULL,
	[OrderDate] [datetime2](7) NOT NULL,
	[TotalAmount] [decimal](18, 2) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostInjectionMonitorings]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostInjectionMonitorings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[InjectionLogId] [int] NOT NULL,
	[StartTime] [datetime2](7) NOT NULL,
	[EndTime] [datetime2](7) NULL,
	[ReactionNote] [nvarchar](500) NULL,
	[IsNormal] [bit] NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_PostInjectionMonitorings] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Prescriptions]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Prescriptions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ScreeningResultId] [int] NOT NULL,
	[VaccineId] [int] NOT NULL,
	[DoseNumber] [int] NOT NULL,
 CONSTRAINT [PK_Prescriptions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ScreeningResults]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ScreeningResults](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VisitId] [int] NOT NULL,
	[Height] [decimal](5, 2) NULL,
	[Weight] [decimal](5, 2) NULL,
	[Temperature] [decimal](4, 2) NULL,
	[IsEligible] [bit] NOT NULL,
	[DoctorNote] [nvarchar](max) NOT NULL,
	[BloodPressure] [nvarchar](max) NULL,
	[ClinicalAssessment] [nvarchar](max) NULL,
	[ExaminationTime] [datetime2](7) NOT NULL,
	[HeartRate] [int] NULL,
	[RespiratoryRate] [int] NULL,
 CONSTRAINT [PK_ScreeningResults] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VaccineBatches]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VaccineBatches](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VaccineId] [int] NOT NULL,
	[BatchNumber] [nvarchar](50) NOT NULL,
	[ExpiryDate] [datetime2](7) NOT NULL,
	[QuantityInStock] [int] NOT NULL,
 CONSTRAINT [PK_VaccineBatches] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccines]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vaccines](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NOT NULL,
	[TargetAgeRange] [nvarchar](max) NOT NULL,
	[Contraindications] [nvarchar](max) NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_Vaccines] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Visits]    Script Date: 09/03/2026 10:37:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Visits](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CustomerId] [int] NOT NULL,
	[CheckInTime] [datetime2](7) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_Visits] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260307083514_InitDatabase', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260307084852_addFied_Salt_for_User', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260307090715_RevertToPasswordHashOnly', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260307111302_UpdateCustomerRegistrationFields', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260308021737_AddOrderAndInvoiceLogic', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260308030008_UpdateScreeningVitalSigns', N'8.0.13')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260308054709_Migration_Inject_Entity', N'8.0.13')
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (53, N'CUST20260307683', N'Ng Văn An', CAST(N'2012-01-09T00:00:00.0000000' AS DateTime2), N'Nam', N'', N'123 Tân an, Phường Tân An, Tỉnh Bắc Ninh', NULL, N'Cha Văn A', N'', N'Cha', N'1234567890', N'Dị ứng cafe')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (54, N'CUST20260308001', N'Đỗ Hữu Phước', CAST(N'2009-12-05T08:34:15.1100000' AS DateTime2), N'Nữ', N'0912891112', N'1 Đường số 2, Phường 2, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0912891112', N'Cha', N'000445404245', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (55, N'CUST20260308002', N'Phan Đức Huy', CAST(N'2025-01-15T08:34:15.1100000' AS DateTime2), N'Nam', N'0905869603', N'2 Đường số 3, Phường 3, TP. Hồ Chí Minh', NULL, N'Cha Phan Đức Huy', N'0905869603', N'Cha', N'000769579513', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (56, N'CUST20260308003', N'Đỗ Hữu Phước', CAST(N'2010-05-28T08:34:15.1100000' AS DateTime2), N'Nữ', N'0902579308', N'3 Đường số 4, Phường 4, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0902579308', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (57, N'CUST20260308004', N'Nguyễn Đức Huy', CAST(N'2009-02-03T08:34:15.1100000' AS DateTime2), N'Nam', N'0968399960', N'4 Đường số 5, Phường 5, TP. Hồ Chí Minh', NULL, N'Cha Nguyễn Đức Huy', N'0968399960', N'Cha', N'001267815143', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (58, N'CUST20260308005', N'Hoàng Thành Long', CAST(N'2003-11-11T08:34:15.1100000' AS DateTime2), N'Nữ', N'0992323365', N'5 Đường số 6, Phường 6, TP. Hồ Chí Minh', NULL, N'Cha Hoàng Thành Long', N'0992323365', N'Cha', N'000494274346', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (59, N'CUST20260308006', N'Lê Hữu Phước', CAST(N'2005-12-16T08:34:15.1100000' AS DateTime2), N'Nam', N'0947753894', N'6 Đường số 7, Phường 7, TP. Hồ Chí Minh', NULL, N'Cha Lê Hữu Phước', N'0947753894', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (60, N'CUST20260308007', N'Đặng Hữu Phước', CAST(N'2019-06-17T08:34:15.1100000' AS DateTime2), N'Nữ', N'0921187454', N'7 Đường số 8, Phường 8, TP. Hồ Chí Minh', NULL, N'Cha Đặng Hữu Phước', N'0921187454', N'Cha', N'000709642918', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (61, N'CUST20260308008', N'Đỗ Thành Long', CAST(N'2015-09-23T08:34:15.1100000' AS DateTime2), N'Nam', N'0973244420', N'8 Đường số 9, Phường 9, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Thành Long', N'0973244420', N'Cha', N'001652406166', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (62, N'CUST20260308009', N'Đỗ Thanh Tùng', CAST(N'2017-10-26T08:34:15.1100000' AS DateTime2), N'Nữ', N'0916207363', N'9 Đường số 10, Phường 10, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Thanh Tùng', N'0916207363', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (63, N'CUST20260308010', N'Vũ Hữu Phước', CAST(N'2025-11-06T08:34:15.1100000' AS DateTime2), N'Nam', N'0990298978', N'10 Đường số 11, Phường 1, TP. Hồ Chí Minh', NULL, N'Cha Vũ Hữu Phước', N'0990298978', N'Cha', N'000411924874', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (64, N'CUST20260308011', N'Đặng Đức Huy', CAST(N'2023-08-27T08:34:15.1100000' AS DateTime2), N'Nữ', N'0973982331', N'11 Đường số 12, Phường 2, TP. Hồ Chí Minh', NULL, N'Cha Đặng Đức Huy', N'0973982331', N'Cha', N'000678351804', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (65, N'CUST20260308012', N'Nguyễn Hữu Phước', CAST(N'2024-04-30T08:34:15.1100000' AS DateTime2), N'Nam', N'0920961928', N'12 Đường số 13, Phường 3, TP. Hồ Chí Minh', NULL, N'Cha Nguyễn Hữu Phước', N'0920961928', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (66, N'CUST20260308013', N'Đỗ Hữu Phước', CAST(N'2005-12-21T08:34:15.1100000' AS DateTime2), N'Nữ', N'0957155504', N'13 Đường số 14, Phường 4, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0957155504', N'Cha', N'001784030943', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (67, N'CUST20260308014', N'Đỗ Thanh Tùng', CAST(N'2014-03-25T00:00:00.0000000' AS DateTime2), N'Nam', N'0943374350', N'14 Đường số 15, Phường 5, TP. Hồ Chí Minh, Phường Tân An, Tỉnh Bắc Ninh', NULL, N'Cha Đỗ Thanh Tùng', N'0943374350', N'Cha', N'000676923292', N'Test dị ứng 123')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (68, N'CUST20260308015', N'Lê Đức Huy', CAST(N'2010-01-18T08:34:15.1100000' AS DateTime2), N'Nữ', N'0983322585', N'15 Đường số 16, Phường 6, TP. Hồ Chí Minh', NULL, N'Cha Lê Đức Huy', N'0983322585', N'Cha', NULL, N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (69, N'CUST20260308016', N'Đỗ Hoài An', CAST(N'2013-07-08T08:34:15.1100000' AS DateTime2), N'Nam', N'0953373381', N'16 Đường số 17, Phường 7, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hoài An', N'0953373381', N'Cha', N'000527227812', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (70, N'CUST20260308017', N'Phan Văn Nam', CAST(N'2019-07-25T08:34:15.1100000' AS DateTime2), N'Nữ', N'0931880852', N'17 Đường số 18, Phường 8, TP. Hồ Chí Minh', NULL, N'Cha Phan Văn Nam', N'0931880852', N'Cha', N'002047976031', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (71, N'CUST20260308018', N'Vũ Hữu Phước', CAST(N'2022-01-07T08:34:15.1100000' AS DateTime2), N'Nam', N'0942744527', N'18 Đường số 19, Phường 9, TP. Hồ Chí Minh', NULL, N'Cha Vũ Hữu Phước', N'0942744527', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (72, N'CUST20260308019', N'Đỗ Hữu Phước', CAST(N'2001-06-07T08:34:15.1100000' AS DateTime2), N'Nữ', N'0940704960', N'19 Đường số 20, Phường 10, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0940704960', N'Cha', N'001313787396', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (73, N'CUST20260308020', N'Đỗ Thanh Tùng', CAST(N'1999-03-26T08:34:15.1100000' AS DateTime2), N'Nam', N'0926310011', N'20 Đường số 1, Phường 1, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Thanh Tùng', N'0926310011', N'Cha', N'002094744305', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (74, N'CUST20260308021', N'Đỗ Hữu Phước', CAST(N'2014-09-29T08:34:15.1100000' AS DateTime2), N'Nữ', N'0913243042', N'21 Đường số 2, Phường 2, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0913243042', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (75, N'CUST20260308022', N'Đỗ Minh Anh', CAST(N'2026-02-02T08:34:15.1100000' AS DateTime2), N'Nam', N'0969699170', N'22 Đường số 3, Phường 3, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Minh Anh', N'0969699170', N'Cha', N'000730513322', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (76, N'CUST20260308023', N'Bùi Thành Long', CAST(N'2024-05-15T08:34:15.1100000' AS DateTime2), N'Nữ', N'0916699399', N'23 Đường số 4, Phường 4, TP. Hồ Chí Minh', NULL, N'Cha Bùi Thành Long', N'0916699399', N'Cha', N'001079394050', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (77, N'CUST20260308024', N'Đỗ Ngọc Bích', CAST(N'2008-11-21T08:34:15.1100000' AS DateTime2), N'Nam', N'0910215137', N'24 Đường số 5, Phường 5, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Ngọc Bích', N'0910215137', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (78, N'CUST20260308025', N'Phạm Hữu Phước', CAST(N'2004-12-04T08:34:15.1100000' AS DateTime2), N'Nữ', N'0981987691', N'25 Đường số 6, Phường 6, TP. Hồ Chí Minh', NULL, N'Cha Phạm Hữu Phước', N'0981987691', N'Cha', N'000750922434', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (79, N'CUST20260308026', N'Nguyễn Hoài An', CAST(N'2005-10-20T08:34:15.1100000' AS DateTime2), N'Nam', N'0995630150', N'26 Đường số 7, Phường 7, TP. Hồ Chí Minh', NULL, N'Cha Nguyễn Hoài An', N'0995630150', N'Cha', N'001997079587', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (80, N'CUST20260308027', N'Phạm Thanh Tùng', CAST(N'2000-03-26T08:34:15.1100000' AS DateTime2), N'Nữ', N'0969270289', N'27 Đường số 8, Phường 8, TP. Hồ Chí Minh', NULL, N'Cha Phạm Thanh Tùng', N'0969270289', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (81, N'CUST20260308028', N'Đỗ Hữu Phước', CAST(N'2014-07-03T08:34:15.1100000' AS DateTime2), N'Nam', N'0932497818', N'28 Đường số 9, Phường 9, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0932497818', N'Cha', N'000485357939', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (82, N'CUST20260308029', N'Hoàng Hữu Phước', CAST(N'2018-11-27T08:34:15.1133333' AS DateTime2), N'Nữ', N'0914317275', N'29 Đường số 10, Phường 10, TP. Hồ Chí Minh', NULL, N'Cha Hoàng Hữu Phước', N'0914317275', N'Cha', N'001838564473', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (83, N'CUST20260308030', N'Lê Hữu Phước', CAST(N'2010-02-23T08:34:15.1133333' AS DateTime2), N'Nam', N'0952402070', N'30 Đường số 11, Phường 1, TP. Hồ Chí Minh', NULL, N'Cha Lê Hữu Phước', N'0952402070', N'Cha', NULL, N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (84, N'CUST20260308031', N'Đỗ Đức Huy', CAST(N'2015-10-15T08:34:15.1133333' AS DateTime2), N'Nữ', N'0951776875', N'31 Đường số 12, Phường 2, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Đức Huy', N'0951776875', N'Cha', N'001381574282', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (85, N'CUST20260308032', N'Hoàng Đức Huy', CAST(N'2009-06-26T08:34:15.1133333' AS DateTime2), N'Nam', N'0956251872', N'32 Đường số 13, Phường 3, TP. Hồ Chí Minh', NULL, N'Cha Hoàng Đức Huy', N'0956251872', N'Cha', N'002146449987', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (86, N'CUST20260308033', N'Phan Hữu Phước', CAST(N'2025-12-21T08:34:15.1133333' AS DateTime2), N'Nữ', N'0929899659', N'33 Đường số 14, Phường 4, TP. Hồ Chí Minh', NULL, N'Cha Phan Hữu Phước', N'0929899659', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (87, N'CUST20260308034', N'Phạm Hữu Phước', CAST(N'2012-12-14T08:34:15.1133333' AS DateTime2), N'Nam', N'0942724254', N'34 Đường số 15, Phường 5, TP. Hồ Chí Minh', NULL, N'Cha Phạm Hữu Phước', N'0942724254', N'Cha', N'000409643984', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (88, N'CUST20260308035', N'Đỗ Hữu Phước', CAST(N'1999-11-30T08:34:15.1133333' AS DateTime2), N'Nữ', N'0969440748', N'35 Đường số 16, Phường 6, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0969440748', N'Cha', N'000811304129', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (89, N'CUST20260308036', N'Hoàng Thành Long', CAST(N'2023-09-27T08:34:15.1133333' AS DateTime2), N'Nam', N'0928863769', N'36 Đường số 17, Phường 7, TP. Hồ Chí Minh', NULL, N'Cha Hoàng Thành Long', N'0928863769', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (90, N'CUST20260308037', N'Vũ Hữu Phước', CAST(N'2005-05-14T08:34:15.1133333' AS DateTime2), N'Nữ', N'0980256813', N'37 Đường số 18, Phường 8, TP. Hồ Chí Minh', NULL, N'Cha Vũ Hữu Phước', N'0980256813', N'Cha', N'001065291004', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (91, N'CUST20260308038', N'Đặng Thị Lan', CAST(N'2010-08-20T08:34:15.1133333' AS DateTime2), N'Nam', N'0929398344', N'38 Đường số 19, Phường 9, TP. Hồ Chí Minh', NULL, N'Cha Đặng Thị Lan', N'0929398344', N'Cha', N'001187268878', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (92, N'CUST20260308039', N'Đỗ Thị Lan', CAST(N'2016-09-01T08:34:15.1133333' AS DateTime2), N'Nữ', N'0907307469', N'39 Đường số 20, Phường 10, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Thị Lan', N'0907307469', N'Cha', NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (93, N'CUST20260308040', N'Trần Đức Huy', CAST(N'2018-06-01T08:34:15.1133333' AS DateTime2), N'Nam', N'0959815719', N'40 Đường số 1, Phường 1, TP. Hồ Chí Minh', NULL, N'Cha Trần Đức Huy', N'0959815719', N'Cha', N'000689195642', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (94, N'CUST20260308041', N'Nguyễn Hoài An', CAST(N'2020-03-14T08:34:15.1133333' AS DateTime2), N'Nữ', N'0913397236', N'41 Đường số 2, Phường 2, TP. Hồ Chí Minh', NULL, N'Cha Nguyễn Hoài An', N'0913397236', N'Cha', N'001647029685', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (95, N'CUST20260308042', N'Vũ Văn Nam', CAST(N'2006-11-12T00:00:00.0000000' AS DateTime2), N'Nam', N'0960860030', N'42 Đường số 3, Phường 3, TP. Hồ Chí Minh', NULL, N'Cha Vũ Văn Nam', N'0960860030', N'Cha', NULL, N'')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (96, N'CUST20260308043', N'Đặng Minh Anh', CAST(N'2018-08-17T00:00:00.0000000' AS DateTime2), N'Nữ', N'0907627647', N'43 Đường số 4, Phường 4, TP. Hồ Chí Minh', NULL, N'Cha Đặng Minh Anh', N'0907627647', N'Cha', N'001878619474', N'Dị ứng cfe')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (97, N'CUST20260308044', N'Đỗ Thị Lan', CAST(N'1999-09-26T00:00:00.0000000' AS DateTime2), N'Nam', N'0914297633', N'44 Đường số 5, Phường 5, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Thị Lan', N'0914297633', N'Cha', N'001549225901', N'')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (98, N'CUST20260308045', N'Đặng Thanh Tùng', CAST(N'1999-06-28T08:34:15.1133333' AS DateTime2), N'Nữ', N'0931688653', N'45 Đường số 6, Phường 6, TP. Hồ Chí Minh', NULL, N'Cha Đặng Thanh Tùng', N'0931688653', N'Cha', NULL, N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (99, N'CUST20260308046', N'Đỗ Hữu Phước', CAST(N'2002-04-20T08:34:15.1133333' AS DateTime2), N'Nam', N'0961841780', N'46 Đường số 7, Phường 7, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0961841780', N'Cha', N'001939285489', NULL)
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (100, N'CUST20260308047', N'Đỗ Hữu Phước', CAST(N'2004-11-18T00:00:00.0000000' AS DateTime2), N'Nữ', N'0903992315', N'47 Đường số 8, Phường 8, TP. Hồ Chí Minh', NULL, N'Cha Đỗ Hữu Phước', N'0903992315', N'Cha', N'000172573054', N'Dị ứng thuốc lá')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (101, N'CUST20260308048', N'Trần Đức Huy', CAST(N'2004-08-14T00:00:00.0000000' AS DateTime2), N'Nam', N'0978727069', N'Đường số 9, Xã Tân Tiến, Tỉnh Tuyên Quang', NULL, N'Cha Trần Đức Huy', N'0978727069', N'Cha', NULL, N'Dị ứng cá nghừ')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (102, N'CUST20260308049', N'Phạm Thanh Tùng', CAST(N'2005-05-05T00:00:00.0000000' AS DateTime2), N'Nữ', N'0916074742', N'49 Đường số 10, Phường 10, TP. Hồ Chí Minh', NULL, N'Cha Phạm Thanh Tùng', N'0916074742', N'Cha', N'001784629513', N'')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (103, N'CUST20260308050', N'Đặng Đức Huy', CAST(N'2012-09-09T00:00:00.0000000' AS DateTime2), N'Nam', N'0935656488', N'50 Đường số 11, Phường 1, TP. Hồ Chí Minh, Phường Chu Văn An, Thành phố Hải Phòng', NULL, N'Cha Đặng Đức Huy', N'0935656488', N'Cha', N'001442433443', N'Tiền sử dị ứng đạm đậu nành')
GO
INSERT [dbo].[Customers] ([Id], [PID], [FullName], [DOB], [Gender], [Phone], [Address], [ParentId], [GuardianName], [GuardianPhone], [GuardianRelation], [IdentityCard], [MedicalHistory]) VALUES (104, N'CUST20260308945', N'Đỗ Thanh Tùng', CAST(N'2014-03-25T00:00:00.0000000' AS DateTime2), N'Nam', N'0943374350', N'14 Đường số 15, Phường 5, TP. Hồ Chí Minh, Phường Tân An, Tỉnh Bắc Ninh', NULL, N'Cha Đỗ Thanh Tùng', N'0943374350', N'Cha', N'000676923292', N'Test dị ứng 123')
GO
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[InjectionLogs] ON 
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (14, 67, 1, 251, N'Tay trái (Cơ Delta)', CAST(N'2026-03-09T01:24:44.6440834' AS DateTime2))
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (15, 66, 1, 248, N'Tay trái (Cơ Delta)', CAST(N'2026-03-09T01:24:46.9602842' AS DateTime2))
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (16, 65, 1, 243, N'Tay trái (Cơ Delta)', CAST(N'2026-03-09T01:24:48.5520157' AS DateTime2))
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (17, 64, 3, 242, N'Tay trái (Cơ Delta) test', CAST(N'2026-03-09T03:29:31.9376974' AS DateTime2))
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (18, 62, 3, 248, N'Tay trái (Cơ Delta) b', CAST(N'2026-03-09T05:17:29.9602581' AS DateTime2))
GO
INSERT [dbo].[InjectionLogs] ([Id], [PrescriptionId], [NurseId], [BatchId], [InjectionSite], [InjectionTime]) VALUES (19, 63, 3, 251, N'Tay trái (Cơ Delta)', CAST(N'2026-03-09T05:17:32.4067205' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[InjectionLogs] OFF
GO
SET IDENTITY_INSERT [dbo].[Invoices] ON 
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (62, 64, CAST(1350000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T01:24:10.1126831' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (63, 65, CAST(635000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T01:25:08.3287851' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (64, 66, CAST(1615000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T01:24:05.8139499' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (65, 67, CAST(980000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T03:29:02.1185925' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (66, 68, CAST(445000.00 AS Decimal(18, 2)), 0, NULL)
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (67, 69, CAST(980000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T01:24:02.9788830' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (68, 70, CAST(1615000.00 AS Decimal(18, 2)), 0, CAST(N'2026-03-09T01:24:00.0052282' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (69, 71, CAST(635000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T02:01:01.2226592' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (70, 72, CAST(635000.00 AS Decimal(18, 2)), 1, CAST(N'2026-03-09T05:14:11.1346621' AS DateTime2))
GO
INSERT [dbo].[Invoices] ([Id], [VisitId], [TotalAmount], [PaymentStatus], [PaymentTime]) VALUES (71, 73, CAST(635000.00 AS Decimal(18, 2)), 2, NULL)
GO
SET IDENTITY_INSERT [dbo].[Invoices] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] ON 
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (184, 67, 122, 1, CAST(980000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (188, 63, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (189, 63, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (190, 62, 121, 1, CAST(1350000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (191, 64, 122, 1, CAST(980000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (192, 64, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (193, 64, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (194, 65, 122, 1, CAST(980000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (195, 68, 122, 1, CAST(980000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (196, 68, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (197, 68, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (200, 69, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (201, 69, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (202, 70, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (203, 70, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (204, 66, 123, 1, CAST(325000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (205, 66, 129, 1, CAST(120000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (206, 71, 127, 1, CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[OrderDetails] ([Id], [OrderId], [VaccineId], [Quantity], [UnitPrice]) VALUES (207, 71, 130, 1, CAST(385000.00 AS Decimal(18, 2)))
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (62, 64, N'ORD202603097722', CAST(N'2026-03-09T01:21:52.8180626' AS DateTime2), CAST(1350000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (63, 65, N'ORD202603095641', CAST(N'2026-03-09T01:22:02.2623241' AS DateTime2), CAST(635000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (64, 66, N'ORD202603097154', CAST(N'2026-03-09T01:22:18.7004260' AS DateTime2), CAST(1615000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (65, 67, N'ORD202603093569', CAST(N'2026-03-09T01:22:34.3849044' AS DateTime2), CAST(980000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (66, 68, N'ORD202603092055', CAST(N'2026-03-09T01:23:07.0496608' AS DateTime2), CAST(445000.00 AS Decimal(18, 2)), 1)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (67, 69, N'ORD202603095057', CAST(N'2026-03-09T01:23:24.4289491' AS DateTime2), CAST(980000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (68, 70, N'ORD202603093718', CAST(N'2026-03-09T01:23:33.8912423' AS DateTime2), CAST(1615000.00 AS Decimal(18, 2)), 1)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (69, 71, N'ORD202603098882', CAST(N'2026-03-09T02:00:40.6385032' AS DateTime2), CAST(635000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (70, 72, N'ORD202603099625', CAST(N'2026-03-09T03:28:28.7291335' AS DateTime2), CAST(635000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[Orders] ([Id], [VisitId], [OrderNumber], [OrderDate], [TotalAmount], [Status]) VALUES (71, 73, N'ORD202603099252', CAST(N'2026-03-09T05:13:21.6650471' AS DateTime2), CAST(635000.00 AS Decimal(18, 2)), 3)
GO
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[PostInjectionMonitorings] ON 
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (14, 14, CAST(N'2026-03-09T01:24:44.6545686' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (15, 15, CAST(N'2026-03-09T01:24:46.9603611' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (16, 16, CAST(N'2026-03-09T01:24:48.5520867' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (17, 17, CAST(N'2026-03-09T03:29:31.9684004' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (18, 18, CAST(N'2026-03-09T05:17:29.9604964' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
INSERT [dbo].[PostInjectionMonitorings] ([Id], [InjectionLogId], [StartTime], [EndTime], [ReactionNote], [IsNormal], [Status]) VALUES (19, 19, CAST(N'2026-03-09T05:17:32.4069043' AS DateTime2), NULL, NULL, 1, N'Monitoring')
GO
SET IDENTITY_INSERT [dbo].[PostInjectionMonitorings] OFF
GO
SET IDENTITY_INSERT [dbo].[Prescriptions] ON 
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (62, 42, 127, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (63, 42, 130, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (64, 43, 121, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (65, 44, 122, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (66, 44, 127, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (67, 44, 130, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (68, 45, 122, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (69, 46, 122, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (70, 46, 127, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (71, 46, 130, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (72, 47, 127, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (73, 47, 130, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (74, 48, 123, 1)
GO
INSERT [dbo].[Prescriptions] ([Id], [ScreeningResultId], [VaccineId], [DoseNumber]) VALUES (75, 48, 129, 1)
GO
SET IDENTITY_INSERT [dbo].[Prescriptions] OFF
GO
SET IDENTITY_INSERT [dbo].[ScreeningResults] ON 
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (42, 65, NULL, NULL, NULL, 1, N'', N'', N'', CAST(N'2026-03-09T01:23:39.7861303' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (43, 64, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T01:23:45.4663114' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (44, 66, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T01:23:49.9314842' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (45, 67, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T01:23:53.5794962' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (46, 70, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T01:25:00.1316670' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (47, 71, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T02:00:48.1663262' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (48, 68, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(36.50 AS Decimal(4, 2)), 1, N'Ghi chú: đủ điều kiện tiêm', N'120/80', N'Đạt khám lâm sàng', CAST(N'2026-03-09T03:28:46.1165944' AS DateTime2), 80, 20)
GO
INSERT [dbo].[ScreeningResults] ([Id], [VisitId], [Height], [Weight], [Temperature], [IsEligible], [DoctorNote], [BloodPressure], [ClinicalAssessment], [ExaminationTime], [HeartRate], [RespiratoryRate]) VALUES (49, 73, CAST(170.00 AS Decimal(5, 2)), CAST(65.00 AS Decimal(5, 2)), CAST(38.50 AS Decimal(4, 2)), 0, N'Ghi chú: không đủ điều kiện tiêm', N'130/85', N'Không đạt khám lâm sàng', CAST(N'2026-03-09T05:13:52.8429057' AS DateTime2), 95, 24)
GO
SET IDENTITY_INSERT [dbo].[ScreeningResults] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Username], [FullName], [PasswordHash], [Role]) VALUES (1, N'admin_', N'Demo Admin', N'$2a$11$f8FobLYy/dq7IUt4J1B/0Oo4rmFCnn6tEqermm8lKW52.ZKBkOQuO', N'admin')
GO
INSERT [dbo].[Users] ([Id], [Username], [FullName], [PasswordHash], [Role]) VALUES (2, N'test', N'TEst Admin', N'$2a$11$f8FobLYy/dq7IUt4J1B/0Oo4rmFCnn6tEqermm8lKW52.ZKBkOQuO', N'admin')
GO
INSERT [dbo].[Users] ([Id], [Username], [FullName], [PasswordHash], [Role]) VALUES (3, N'admin', N'Demo Admin', N'$2a$11$rffA10aTFaj6LvbxTOnt7eMKjLj7LOXb62.6vVwZ0u//X1yd7FyJa', N'admin')
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[VaccineBatches] ON 
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (222, 121, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (223, 122, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (224, 123, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (225, 124, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (226, 125, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (227, 126, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (228, 127, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (229, 128, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (230, 129, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (231, 130, N'LO-1-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (232, 121, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (233, 122, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (234, 123, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (235, 124, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (236, 125, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (237, 126, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (238, 127, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (239, 128, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (240, 129, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (241, 130, N'LO-2-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (242, 121, N'FEFO-202603', CAST(N'2026-03-28T20:11:34.2133333' AS DateTime2), 9)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (243, 122, N'FEFO-202603', CAST(N'2026-03-28T20:11:34.2133333' AS DateTime2), 9)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (244, 123, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (245, 124, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (246, 125, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (247, 126, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (248, 127, N'FEFO-202603', CAST(N'2026-03-28T20:11:34.2133333' AS DateTime2), 7)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (249, 128, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (250, 129, N'FEFO-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 60)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (251, 130, N'FEFO-202603', CAST(N'2026-03-28T20:11:34.2133333' AS DateTime2), 6)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (252, 129, N'LO-3-202603', CAST(N'2028-06-30T00:00:00.0000000' AS DateTime2), 100)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (253, 130, N'LO-3-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 150)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (254, 121, N'LO-3-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (255, 127, N'LO-3-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
INSERT [dbo].[VaccineBatches] ([Id], [VaccineId], [BatchNumber], [ExpiryDate], [QuantityInStock]) VALUES (256, 122, N'LO-3-202603', CAST(N'2027-04-10T00:00:00.0000000' AS DateTime2), 50)
GO
SET IDENTITY_INSERT [dbo].[VaccineBatches] OFF
GO
SET IDENTITY_INSERT [dbo].[Vaccines] ON 
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (121, N'Vắc xin 6 trong 1 (Hexaxim/Infanrix)', N'Phòng bạch hầu, uốn ván, ho gà, bại liệt, viêm gan B và Hib. Phác đồ 3 mũi cơ bản.', N'2 tháng - 5 tuổi', N'Dị ứng với thành phần của vắc xin', CAST(1350000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (122, N'Vắc xin Phế cầu (Synflorix/Prevenar 13)', N'Phòng viêm phổi, viêm màng não, viêm tai giữa do phế cầu khuẩn.', N'6 tuần - 15 tuổi', N'Dị ứng với latex, diphtheria toxoid', CAST(980000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (123, N'Vắc xin Sởi - Quai bị - Rubella (MMR II)', N'Phòng bệnh sởi, quai bị và rubella (rubeon). Tiêm 2 mũi cơ bản.', N'12 tháng - người lớn', N'Phụ nữ có thai, suy giảm miễn dịch nặng', CAST(325000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (124, N'Vắc xin Thủy đậu (Varivax)', N'Phòng bệnh thủy đậu (trái rạ). Hiệu quả trên 90%. Tiêm 2 mũi.', N'12 tháng - người lớn', N'Phụ nữ có thai, dị ứng neomycin', CAST(850000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (125, N'Vắc xin Viêm não Nhật Bản (Imojev)', N'Vắc xin sống giảm độc lực phòng viêm não Nhật Bản. Chỉ cần 1 mũi duy nhất.', N'9 tháng - 60 tuổi', N'Phụ nữ có thai, suy giảm miễn dịch', CAST(530000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (126, N'Vắc xin Ung thư cổ tử cung (Gardasil 9)', N'Phòng ung thư cổ tử cung, các bệnh do HPV type 6, 11, 16, 18, 31, 33, 45, 52, 58.', N'9 - 45 tuổi (nam & nữ)', N'Dị ứng với thành phần men nấm', CAST(1850000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (127, N'Vắc xin Ho gà - Bạch hầu - Uốn ván', N'Vắc xin nhắc lại phòng ho gà - bạch hầu - uốn ván cho trẻ em và người lớn.', N'4 tuổi - người lớn', N'Tiền sử co giật sau liều trước', CAST(250000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (128, N'Vắc xin Viêm gan A + B (Twinrix)', N'Phòng đồng thời viêm gan A và viêm gan B. Phác đồ 3 mũi.', N'1 tuổi - người lớn', N'Dị ứng với neomycin, formaldehyde', CAST(460000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (129, N'Vắc xin Tả (mORCVAX)', N'Vắc xin uống phòng bệnh tả. Hiệu quả bảo vệ ~67%. Uống 2 liều cách nhau 2 tuần.', N'2 tuổi - người lớn', N'Đang sốt cấp tính, rối loạn tiêu hóa', CAST(120000.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[Vaccines] ([Id], [Name], [Description], [TargetAgeRange], [Contraindications], [Price]) VALUES (130, N'Vắc xin Cúm Tứ giá (Influvac Tetra)', N'Phòng cúm mùa 4 chủng A/H1N1, A/H3N2, B/Victoria, B/Yamagata. Tiêm nhắc mỗi năm.', N'6 tháng - người lớn', N'Dị ứng trứng gà, dị ứng thành phần vắc xin', CAST(385000.00 AS Decimal(18, 2)))
GO
SET IDENTITY_INSERT [dbo].[Vaccines] OFF
GO
SET IDENTITY_INSERT [dbo].[Visits] ON 
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (64, 67, CAST(N'2026-03-09T01:21:52.8092026' AS DateTime2), 4)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (65, 95, CAST(N'2026-03-09T01:22:02.2521478' AS DateTime2), 4)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (66, 103, CAST(N'2026-03-09T01:22:18.6913602' AS DateTime2), 4)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (67, 102, CAST(N'2026-03-09T01:22:34.3768788' AS DateTime2), 3)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (68, 100, CAST(N'2026-03-09T01:23:07.0410293' AS DateTime2), 2)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (69, 97, CAST(N'2026-03-09T01:23:24.4199766' AS DateTime2), 0)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (70, 96, CAST(N'2026-03-09T01:23:33.8824258' AS DateTime2), 3)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (71, 53, CAST(N'2026-03-09T02:00:40.4134552' AS DateTime2), 3)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (72, 67, CAST(N'2026-03-09T03:28:28.7163711' AS DateTime2), 0)
GO
INSERT [dbo].[Visits] ([Id], [CustomerId], [CheckInTime], [Status]) VALUES (73, 101, CAST(N'2026-03-09T05:13:21.6586527' AS DateTime2), 5)
GO
SET IDENTITY_INSERT [dbo].[Visits] OFF
GO
ALTER TABLE [dbo].[ScreeningResults] ADD  DEFAULT ('0001-01-01T00:00:00.0000000') FOR [ExaminationTime]
GO
ALTER TABLE [dbo].[Customers]  WITH CHECK ADD  CONSTRAINT [FK_Customers_Customers_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[Customers] ([Id])
GO
ALTER TABLE [dbo].[Customers] CHECK CONSTRAINT [FK_Customers_Customers_ParentId]
GO
ALTER TABLE [dbo].[InjectionLogs]  WITH CHECK ADD  CONSTRAINT [FK_InjectionLogs_Prescriptions_PrescriptionId] FOREIGN KEY([PrescriptionId])
REFERENCES [dbo].[Prescriptions] ([Id])
GO
ALTER TABLE [dbo].[InjectionLogs] CHECK CONSTRAINT [FK_InjectionLogs_Prescriptions_PrescriptionId]
GO
ALTER TABLE [dbo].[InjectionLogs]  WITH CHECK ADD  CONSTRAINT [FK_InjectionLogs_Users_NurseId] FOREIGN KEY([NurseId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[InjectionLogs] CHECK CONSTRAINT [FK_InjectionLogs_Users_NurseId]
GO
ALTER TABLE [dbo].[InjectionLogs]  WITH CHECK ADD  CONSTRAINT [FK_InjectionLogs_VaccineBatches_BatchId] FOREIGN KEY([BatchId])
REFERENCES [dbo].[VaccineBatches] ([Id])
GO
ALTER TABLE [dbo].[InjectionLogs] CHECK CONSTRAINT [FK_InjectionLogs_VaccineBatches_BatchId]
GO
ALTER TABLE [dbo].[Invoices]  WITH CHECK ADD  CONSTRAINT [FK_Invoices_Visits_VisitId] FOREIGN KEY([VisitId])
REFERENCES [dbo].[Visits] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Invoices] CHECK CONSTRAINT [FK_Invoices_Visits_VisitId]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderDetails_Orders_OrderId] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Orders_OrderId]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderDetails_Vaccines_VaccineId] FOREIGN KEY([VaccineId])
REFERENCES [dbo].[Vaccines] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Vaccines_VaccineId]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_Visits_VisitId] FOREIGN KEY([VisitId])
REFERENCES [dbo].[Visits] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_Orders_Visits_VisitId]
GO
ALTER TABLE [dbo].[PostInjectionMonitorings]  WITH CHECK ADD  CONSTRAINT [FK_PostInjectionMonitorings_InjectionLogs_InjectionLogId] FOREIGN KEY([InjectionLogId])
REFERENCES [dbo].[InjectionLogs] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PostInjectionMonitorings] CHECK CONSTRAINT [FK_PostInjectionMonitorings_InjectionLogs_InjectionLogId]
GO
ALTER TABLE [dbo].[Prescriptions]  WITH CHECK ADD  CONSTRAINT [FK_Prescriptions_ScreeningResults_ScreeningResultId] FOREIGN KEY([ScreeningResultId])
REFERENCES [dbo].[ScreeningResults] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Prescriptions] CHECK CONSTRAINT [FK_Prescriptions_ScreeningResults_ScreeningResultId]
GO
ALTER TABLE [dbo].[Prescriptions]  WITH CHECK ADD  CONSTRAINT [FK_Prescriptions_Vaccines_VaccineId] FOREIGN KEY([VaccineId])
REFERENCES [dbo].[Vaccines] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Prescriptions] CHECK CONSTRAINT [FK_Prescriptions_Vaccines_VaccineId]
GO
ALTER TABLE [dbo].[ScreeningResults]  WITH CHECK ADD  CONSTRAINT [FK_ScreeningResults_Visits_VisitId] FOREIGN KEY([VisitId])
REFERENCES [dbo].[Visits] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ScreeningResults] CHECK CONSTRAINT [FK_ScreeningResults_Visits_VisitId]
GO
ALTER TABLE [dbo].[VaccineBatches]  WITH CHECK ADD  CONSTRAINT [FK_VaccineBatches_Vaccines_VaccineId] FOREIGN KEY([VaccineId])
REFERENCES [dbo].[Vaccines] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VaccineBatches] CHECK CONSTRAINT [FK_VaccineBatches_Vaccines_VaccineId]
GO
ALTER TABLE [dbo].[Visits]  WITH CHECK ADD  CONSTRAINT [FK_Visits_Customers_CustomerId] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Visits] CHECK CONSTRAINT [FK_Visits_Customers_CustomerId]
GO
