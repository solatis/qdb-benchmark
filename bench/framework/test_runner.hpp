#pragma once

#include <bench/core/test_instance.hpp>
#include <bench/framework/test_thread.hpp>
#include <utils/memory.hpp>

#include <chrono>
#include <iostream>

namespace bench
{
namespace framework
{

using clock = std::chrono::high_resolution_clock;

class test_runner
{
public:
    test_runner(test_instance & test) : _test(test)
    {
    }

    ~test_runner()
    {
    }

    void run()
    {
        create_threads();
        start_threads();
        wait_test_duration();
        stop_threads();
        collect_results();
    }

private:
    void create_threads()
    {
        for (int i = 0; i < _test.config.thread_count; i++)
            _threads.emplace_back(utils::make_unique<test_thread>(_test));
    }

    void start_threads()
    {
        _start_time = clock::now();
        for (auto & thread : _threads)
            thread->start();
    }

    void stop_threads()
    {
        for (auto & thread : _threads)
            thread->stop();
    }

    void collect_results()
    {
        for (auto & thread : _threads)
        {
            thread->stop();

            test_result::thread_data result;

            for (test_thread::sample_type sample : thread->result())
            {
                result.push_back({get_elapsed_time(sample.time), sample.iterations});
            }

            _test.result.threads.emplace_back(result);
        }
    }

    unsigned long get_elapsed_time(clock::time_point time) const
    {
        return static_cast<unsigned long>(
            std::chrono::duration_cast<std::chrono::milliseconds>(time - _start_time).count());
    }

    void wait_test_duration() const
    {
        std::this_thread::sleep_for(_test.config.duration);
    }

    test_instance & _test;
    std::vector<std::unique_ptr<test_thread>> _threads;
    clock::time_point _start_time;
};

void run_test(test_instance & test)
{
    test_runner(test).run();
}
}
}
