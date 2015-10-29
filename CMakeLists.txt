cmake_minimum_required(VERSION 3.2)
project(qdb-benchmark)
enable_testing()
include(qdb_api.cmake)

set(CMAKE_CXX_STANDARD 11)

if(NOT MSVC)
    add_compile_options(-Wall -pedantic)
endif()

if(CMAKE_COMPILER_IS_GNUCXX)
    # Force static build
    set(CMAKE_EXE_LINKER_FLAGS "-static-libgcc -static-libstdc++")
endif()

include_directories(${CMAKE_SOURCE_DIR} ${QDB_API_INCLUDE_DIR} ${CMAKE_SOURCE_DIR}/thirdparty)
add_subdirectory(bench/app)
add_subdirectory(bench/core)
add_subdirectory(bench/framework)
add_subdirectory(bench/log)
add_subdirectory(bench/tests)
add_subdirectory(utils)

add_executable(qdb-benchmark
    main.cpp
)

target_compile_definitions(qdb-benchmark
	PRIVATE
	-D_CRT_SECURE_NO_WARNINGS # disable VS warning on getenv()
)

target_link_libraries(qdb-benchmark
    bench-app
    bench-core
    bench-log
    bench-tests
)

add_test(help qdb-benchmark --help)
add_test(run qdb-benchmark --tests qdb_stream_write -d 30 --sizes 1M)

if(WIN32)
    add_custom_command(TARGET qdb-benchmark POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different 
        ${QDB_API_DLL}
        $<TARGET_FILE_DIR:qdb-benchmark>)
endif()

set(CPACK_PACKAGE_VERSION "2.0.0")
set(CPACK_INCLUDE_TOPLEVEL_DIRECTORY 0) 
include(CPack)
install(TARGETS qdb-benchmark
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)

if(WIN32)
    install(FILES ${QDB_API_DLL} DESTINATION bin)
else()
    install(FILES ${QDB_API} DESTINATION lib)
endif()
